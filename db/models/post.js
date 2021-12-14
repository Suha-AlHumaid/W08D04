const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    avatar: { type: String },
    discription: { type: String, required: true },
    title: { type: String, default: "no title" },
    Date: { type: Date, default: Date.now },
    isDele: { type: Boolean, default: false, },
    puplisher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);