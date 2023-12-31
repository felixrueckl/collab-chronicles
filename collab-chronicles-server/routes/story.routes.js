const router = require("express").Router();
const mongoose = require("mongoose");

const Story = require("../models/Story.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

//  GET /api/stories/:userId/finished  -  See all finished stories from the logged in user
router.get("/stories/:userId/finished", isAuthenticated, (req, res, next) => {
  const userId = req.params.userId;
  console.log(userId);
  Story.find({
    $and: [{ authors: { $in: [userId] } }, { gameStatus: "finished" }],
  })
    .then((stories) => {
      if (stories.length > 0) {
        res.status(200).json(stories);
      } else {
        res.status(200).json({ message: "No stories found" });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Error while fetching the stories", error: error });
    });
});

//  GET /api/stories  -  See all stories from the logged in user

router.get("/stories/:storyId", isAuthenticated, (req, res, next) => {
  const { storyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(storyId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  // Each Story document has a `text` array holding `_id`s of Sentence documents
  // We use .populate() method to get swap the `_id`s for the actual Sentence documents
  Story.findById(storyId)
    .populate("text")
    .then((story) => {
      console.log(story);
      res.status(200).json(story);
    })
    .catch((error) => res.json(error));
});
/*
    .populate({
      path: "comments",
      populate: {
        path: "userId",
        select: "username",
*/
// PUT  /api/stories/:storiesId  -  Updates a specific story by id
/* 
router.put('/stories/:storyId', (req, res, next) => {
  const { storyId } = req.params;
 
  if (!mongoose.Types.ObjectId.isValid(storyId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
 
  Story.findByIdAndUpdate(storyId, req.body, { new: true })
    .then((updatedStory) => res.json(updatedStory))
    .catch(error => res.json(error));
});
*/

// DELETE  /api/stoires/:storyId  -  Deletes a specific story by id
/*
router.delete('/stories/:storyId', (req, res, next) => {
  const { storyId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(storyId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
 
  Story.findByIdAndRemove(storyId)
    .then(() => res.json({ message: `Project with ${storyId} is removed successfully.` }))
    .catch(error => res.json(error));
});
*/

router.post("/stories", isAuthenticated, async (req, res, next) => {
  const {
    title,
    creator,
    maxAuthors,
    type,
    rounds,
    musicUrl,
    language,
    voice,
  } = req.body;
  console.log("Received Data:", req.body);

  try {
    // Create a new story
    const newStory = await Story.create({
      title,
      text: [],
      creator,
      authors: [creator],
      maxAuthors,
      currentAuthors: 1,
      currentTurn: 0,
      type,
      rounds,
      musicUrl,
      language,
      comments: [],
      voice,
      currentAuthorTurn: creator,
    });

    // Update the User model
    const updatedUser = await User.findByIdAndUpdate(creator, {
      $push: { stories: newStory._id },
    });

    // Return the response
    res.json({ newStory, updatedUser });
  } catch (err) {
    // Handle errors
    res
      .status(500)
      .json({ error: "An error occurred while creating the story." });
  }
});

router.get("/stories/:storyId/read", isAuthenticated, (req, res, next) => {
  const { storyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(storyId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  // Each Story document has a `text` array holding `_id`s of Sentence documents
  // We use .populate() method to get swap the `_id`s for the actual Sentence documents
  Story.findById(storyId)
    .populate("text")
    .then((story) => res.status(200).json(story))
    .catch((error) => res.json(error));
});

module.exports = router;
