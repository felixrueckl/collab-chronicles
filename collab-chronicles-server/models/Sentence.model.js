const { Schema, model } = require("mongoose");

const sentenceSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    storyId: {
      type: Schema.Types.ObjectId,
      ref: "Story",
    },
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Sentence = model("Sentence", sentenceSchema);

module.exports = Sentence;
