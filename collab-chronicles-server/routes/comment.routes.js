const router = require("express").Router();
const mongoose = require("mongoose");

const Story = require("../models/Story.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");

const { isAuthenticated } = require("../middleware/jwt.middleware");

router.post("/comments", isAuthenticated, (req, res, next) => {
  const { userId, storyId, text } = req.body;

  console.log("userId then storyId:", userId, storyId);

  Comment.create({ userId, text })
    .then((newComment) => {
      console.log("newComment:", newComment);

      // After creating a new comment, find the related story and update its comments
      Story.findByIdAndUpdate(
        storyId,
        { $push: { comments: newComment._id } },
        { new: true }
      )
        .populate("comments")
        .then((updatedStory) => {
          console.log("updatedStory:", updatedStory);
          res.status(200).json(newComment);
        })
        .catch((err) => {
          console.log("Error updating story:", err);
          res.json(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

module.exports = router;
