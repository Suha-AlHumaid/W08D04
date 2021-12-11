const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true , trim: true,},
    userName: { type: String, required: true },
    avatar: { type: String },
    password: { type: String, required: true ,trim: true},
    isDele: { type: Boolean, default: false, required: true },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false
  }
  },
  { timestamps: true }
);
userSchema.methods.generateVerificationToken = function () {
  const user = this;
  const verificationToken = jwt.sign(
      { ID: user._id },
      process.env.secert_key,
      { expiresIn: "7d" }
  );
  return verificationToken;
};
module.exports = mongoose.model("User", userSchema);
