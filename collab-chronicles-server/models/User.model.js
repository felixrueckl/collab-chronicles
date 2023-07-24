const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      //       match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: true,
      trim: true,
    },
    stories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Story",
      },
    ],
    createdStories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Story",
      },
    ],
    savedStories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Story",
      },
    ],
    likedStories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Story",
      },
    ],
    sentences: [
      {
        type: Schema.Types.ObjectId,
        ref: "Sentence",
      },
    ],
    likedSentences: [
      {
        type: Schema.Types.ObjectId,
        ref: "Sentence",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likedComments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
