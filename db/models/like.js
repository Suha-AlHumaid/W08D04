const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    // isDele: { type: Boolean, default: false, required: true },
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

module.exports = mongoose.model("Like", likeSchema);
