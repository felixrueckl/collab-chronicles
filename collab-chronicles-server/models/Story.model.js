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
    },
    authors: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    maxAuthors: { type: Number, required: true },
    currentAuthors: { type: Number, required: true, default: 1 },
    type: {
      type: String,
    },
    rounds: {
      type: Number,
      default: 2,
    },
    currentTurn: {
      type: Number,
      default: 0,
    },
    musicUrl: {
      type: String,
    },
    language: {
      type: String,
    },
    voice: {
      type: String,
    },
    roundNumber: {
      type: Number,
      default: 0,
    },
    gameStatus: {
      type: String,
      enum: ["waiting_for_players", "in_progress", "finished"],
      default: "waiting_for_players",
    },
    currentAuthorTurn: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
