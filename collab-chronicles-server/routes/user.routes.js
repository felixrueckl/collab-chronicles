const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Add this line to import bcrypt
const saltRounds = 10;

const Story = require("../models/Story.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/users/:userId", isAuthenticated, (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .populate("stories") // Populate the stories field to get story details
    .select("-password") // Exclude the password field from the result
    .then((user) => {
      res.json(user);
    })
    .catch((err) => res.status(500).json({ error: "User not found." }));
});

router.put("/users/:userId", isAuthenticated, async (req, res, next) => {
  const { userId } = req.params;
  const { password, username, email } = req.body;

  let updateObject = {};

  try {
    // Check if the password is being updated
    if (password) {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      updateObject.password = hashedPassword;
    }

    // Check if the username is being updated
    if (username) {
      updateObject.username = username;
    }

    // Check if the email is being updated
    if (email) {
      updateObject.email = email;
    }

    // Update the user's details in the database
    const updatedUser = await User.findByIdAndUpdate(userId, updateObject, {
      new: true,
    });

    res.json({
      message: "User details updated successfully.",
      user: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user details." });
  }
});

module.exports = router;
