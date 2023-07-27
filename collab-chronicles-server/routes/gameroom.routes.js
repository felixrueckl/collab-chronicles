const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Story = require("../models/Story.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/gameroom/user/:userId/stories/open", async (req, res) => {
  const { userId } = req.params;
  try {
    const openStories = await Story.find({
      $and: [
        { $expr: { $lt: ["$currentAuthors", "$maxAuthors"] } },
        { authors: { $nin: [userId] } },
      ],
    });

    const formattedStories = openStories.map((story) => {
      return {
        id: story._id,
        title: story.title,
        currentAuthors: story.currentAuthors,
        rounds: story.rounds,
      };
    });

    res.status(200).json(formattedStories);
  } catch (error) {
    console.error("Failed to fetch open stories:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching open stories." });
  }
});

router.put(
  "/gameroom/:storyId/join",
  isAuthenticated,
  async (req, res, next) => {
    const storyId = req.params.storyId;
    const userId = req.body.userId;
    const io = req.app.get("io");
    try {
      const story = await Story.findById(storyId);
      if (!story) {
        return res.status(404).json({ error: "Story not found" });
      }
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
          { new: true }
        );
      }

      console.log("Story After Update:", updatedStory);
      io.in(storyId).emit("updateStory", updatedStory);

      res.json({ message: "Successfully joined story", updatedStory });
    } catch (error) {
      next(error);
    }
  }
);

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
      res.json(story);
    })
    .catch((error) => res.json(error));
});

router.put(
  "/gameroom/:storyId/turn/",
  isAuthenticated,
  async (req, res, next) => {
    const { storyId } = req.params;
    const { turn } = req.body;
    const io = req.app.get("io");
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

      let currentAuthor = story.currentAuthorTurn;
      let currentAuthorIndex = story.authors.indexOf(currentAuthor);
      let nextAuthorIndex = (currentAuthorIndex + 1) % story.authors.length;
      let nextAuthorTurn = story.authors[nextAuthorIndex];

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

      if (
        updatedStory.text.length ===
        updatedStory.maxAuthors * updatedStory.rounds
      ) {
        updatedStory.gameStatus = "finished";
        await updatedStory.save();

        io.to(storyId).emit("endGame", updatedStory);
      }
      console.log(`updatedStory is ${updatedStory}`);

      io.to(storyId).emit("storyUpdated", updatedStory);
      io.on("sentencesSubmitted", ({ storyId }) => {
        io.to(storyId).emit("refreshPage");
      });

      res.json({ updatedStory });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "An error occurred while updating the turn." });
    }
  }
);

module.exports = router;
