const router = require("express").Router();
const mongoose = require("mongoose");

const Story = require("../models/Story.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

//  GET /api/stories  -  See all stories from the logged in user

router.get("/stories", isAuthenticated, (req, res, next) => {
  User.find()
    .populate("stories")
    .then((allStories) => res.json(allStories))
    .catch((err) => res.json(err));
});

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
    .then((story) => res.status(200).json(story))
    .catch((error) => res.json(error));
});

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
  const { title, userId, type, rounds, musicUrl, language, voice } = req.body;

  try {
    // Create a new story
    const newStory = await Story.create({
      title,
      text: [],
      creator: userId,
      authors: [],
      type,
      rounds,
      musicUrl,
      language,
      voice,
      likes: [],
      comments: [],
    });

    // Update the User model
    const updatedUser = await User.findByIdAndUpdate(userId, {
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

module.exports = router;