const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    avatar: { type: String },
    discriptionn: { type: String, required: true },
    title: { type: String, default: "no title" },
    Date: { type: Date, default: Date.now },
    isDele: { type: Boolean, default: false, required: true },
    puplisher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    like: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Like",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
