const { Schema, model } = require("mongoose");

const storySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
    },
    text: [
      {
        type: Schema.Types.ObjectId,
        ref: "Sentence",
      },
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required."],
    },
    authors: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    type: {
      type: String,
      enum: ["Single Player", "Multiplayer"],
    },
    rounds: {
      type: Number,
      default: 2,
    },
    musicUrl: {
      type: String,
    },
    language: {
      type: String,
      enum: ["fr-fr", "hi-in", "ru-ru"],
    },
    voice: {
      type: String,
      enum: ["Bob", "Ana", "Puja", "Kabir", "Olga", "Peter"],
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Story = model("Story", storySchema);

module.exports = Story;
