const router = require("express").Router();
const mongoose = require("mongoose");

const Story = require("../models/Story.model");
const User = require("../models/User.model");
const Sentence = require("../models/Sentence.model");

//  POST /api/sentences  -  Creates a new sentence

router.post("/sentences", async (req, res, next) => {
  const { userId, storyId, text } = req.body;

  try {
    // Create the new sentence
    const newSentence = await Sentence.create({
      userId: userId,
      storyId: storyId,
      text,
    });

    // Update the Story model
    const updatedStory = await Story.findByIdAndUpdate(storyId, {
      $push: { text: newSentence._id },
    });

    // Update the User model
    const updatedUser = await User.findByIdAndUpdate(userId, {
      $push: { sentences: newSentence._id },
    });

    // Return the response
    res.json({ updatedStory, updatedUser });
  } catch (err) {
    // Handle errors
    res
      .status(500)
      .json({ error: "An error occurred while creating the sentence." });
  }
});

module.exports = router;
