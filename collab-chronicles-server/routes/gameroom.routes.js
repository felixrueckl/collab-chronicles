const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Story = require("../models/Story.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/gameroom/user/:userId/stories/open", async (req, res) => {
  const { userId } = req.params;
  try {
    // Fetch open stories from the database
    const openStories = await Story.find({
      $and: [
        { $expr: { $lt: ["$currentAuthors", "$maxAuthors"] } },
        { authors: { $nin: [userId] } },
      ],
    });

    // Format the stories
    const formattedStories = openStories.map((story) => {
      return {
        id: story._id,
        title: story.title,
        currentAuthors: story.currentAuthors,
        rounds: story.rounds,
      };
    });

    // Send the stories to the client
    res.status(200).json(formattedStories);
  } catch (error) {
    // Handle any errors that occur
    console.error("Failed to fetch open stories:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching open stories." });
  }
});

//PUT join a stroy

router.put(
  "/gameroom/:storyId/join",
  isAuthenticated,
  async (req, res, next) => {
    const storyId = req.params.storyId;
    const userId = req.body.userId;
    const io = req.app.get("io");
    try {
      // Find the story with the provided ID
      const story = await Story.findById(storyId);
      if (!story) {
        return res.status(404).json({ error: "Story not found" });
      }
      // Check if the user is already an author of the story
      if (story.authors.map((author) => author.toString()).includes(userId)) {
        return res.json({ message: "User has already joined the story" });
      }

      if (story.currentAuthors >= story.maxAuthors) {
        return res
          .status(400)
          .json({ error: "Maximum number of authors reached" });
      }

      console.log("Story Before Update:", story);

      if (!userId) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      story.authors.push(userId);

      let updatedStory;

      if (story.authors.length === story.maxAuthors) {
        io.to(storyId).emit("lastAuthorJoined");
        // If all authors have joined, start the game by setting the `currentTurn` to the first author
        // and `isGameStarted` to `true`.
        updatedStory = await Story.findByIdAndUpdate(
          storyId,
          {
            authors: story.authors,
            currentAuthors: story.authors.length,
            currentTurn: 1,
            currentAuthorTurn: story.authors[0]
              ? story.authors[0].toString()
              : null,
            gameStatus: "in_progress",
            roundNumber: 1,
          },
          { new: true }
        );
      } else {
        updatedStory = await Story.findByIdAndUpdate(
          storyId,
          {
            authors: story.authors,
            currentAuthors: story.authors.length,
          },
          { new: true } // This returns the updated document
        );
      }

      console.log("Story After Update:", updatedStory);

      // Emit an updateStory event to the Socket.IO room for this story
      // assuming `socket` is available in this scope and you have implemented a room for each story
      io.in(storyId).emit("updateStory", updatedStory);

      // Send a success response
      res.json({ message: "Successfully joined story", updatedStory });
    } catch (error) {
      next(error); // Pass errors to your error handler
    }
  }
);

// GET /api/gameroom/story/:storyId  -  Retrieves the current turn of the story
router.get("/gameroom/story/:storyId", isAuthenticated, (req, res, next) => {
  const { storyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(storyId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Story.findById(storyId)
    .then((story) => {
      if (!story) {
        res.status(404).json({ message: "Story not found" });
        return;
      }

      res.json(story); // Return the whole story instead of just the turn
    })
    .catch((error) => res.json(error));
});

// PUT /api/gameroom/:storyId/turn - Updates the current turn of the story
router.put(
  "/gameroom/:storyId/turn/",
  isAuthenticated,
  async (req, res, next) => {
    const { storyId } = req.params;
    const { turn } = req.body;

    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    try {
      const story = await Story.findById(storyId);
      if (!story) {
        console.log(`Story not found with id ${storyId}`);
        return res.status(404).json({ error: "Story not found" });
      }

      // Handle the turn and round updates
      // Find the next author
      let currentAuthor = story.currentAuthorTurn;
      let currentAuthorIndex = story.authors.indexOf(currentAuthor);
      let nextAuthorIndex = (currentAuthorIndex + 1) % story.authors.length;
      let nextAuthorTurn = story.authors[nextAuthorIndex];
      console.log(`currentAuthor is ${currentAuthor}`);
      console.log(`currentAuthorIndex is ${currentAuthorIndex}`);
      console.log(`nextAuthorIndex is ${nextAuthorIndex}`);
      console.log(`nextAuthorTurn is ${nextAuthorTurn}`);

      // Update the current author turn and turn number
      let updatedStory = await Story.findByIdAndUpdate(
        storyId,
        {
          currentTurn: story.currentTurn + 1,
          currentAuthorTurn: nextAuthorTurn,
        },
        { new: true }
      );

      if (!updatedStory) {
        res.status(404).json({ error: "Story not found" });
        return;
      }

      // Check if the game has ended
      if (
        updatedStory.text.length ===
        updatedStory.maxAuthors * updatedStory.rounds
      ) {
        updatedStory.gameStatus = "finished";
        await updatedStory.save();
      }
      console.log(`updatedStory is ${updatedStory}`);

      // Get the io object
      const io = req.app.get("io");

      // Broadcast the updated story
      io.to(storyId).emit("storyUpdated", updatedStory);

      // Return the response
      res.json({ updatedStory });
    } catch (err) {
      console.error(err); // This will log the full error object
      res
        .status(500)
        .json({ error: "An error occurred while updating the turn." });
    }
  }
);

function getNextAuthorTurn(story) {
  const currentAuthorIndex = story.authors.findIndex(
    (authorId) => authorId === story.currentAuthorTurn
  );
  const nextAuthorIndex = (currentAuthorIndex + 1) % story.authors.length;
  return story.authors[nextAuthorIndex];
}

module.exports = router;
