const router = require("express").Router();
const mongoose = require("mongoose");

const Story = require("../models/Story.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");

//  POST /api/comments  -  Creates a new comment

router.post("/comments", async (req, res, next) => {
  const { userId, storyId, text } = req.body;

  try {
    // Create the new comment
    const newComment = await Comment.create({
      userId: userId,
      storyId: storyId,
      text,
      likes,
    });

    // Update the Story model
    const updatedStory = await Story.findByIdAndUpdate(storyId, {
      $push: { comments: newComment._id },
    });

    // Update the User model
    const updatedUser = await User.findByIdAndUpdate(userId, {
      $push: { comments: newComment._id },
    });

    // Return the response
    res.json({ updatedStory, updatedUser });
  } catch (err) {
    // Handle errors
    res
      .status(500)
      .json({ error: "An error occurred while creating the comment." });
  }
});

module.exports = router;
