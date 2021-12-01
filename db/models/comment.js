const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    discription: { type: String, required: true },
    Date: { type: Date, default: Date.now },
    isDele: { type: Boolean, default: false, required: true },
    isLike: { type: Boolean, default: false, required: true },
    puplisher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
