const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
// authentication middelle wear
const authentication = require("../middlewares/authentication");
// authentication middelle wear
const authorization = require("../middlewares/authorization");
const popuptools = require("popup-tools");
require("../middlewares/passport");



//destructuring
const {
  register,
  login,
  deleteUser,
  deleteUserSoft,
  getAllUser,
  verify,
  forgetPassword,
  // passwordReset,
  resetPassword,
  // passwordUpdated
  googleLogin
} = require("../controllers/user");

//controllers

//register an verify
userRouter.post("/register", register);
userRouter.get('/verify/:token', verify);


userRouter.post("/login", login);

//only admin can delete
// userRouter.delete("/user/:id", authentication, authorization, deleteUser);

//only admin can delete soft
userRouter.delete("/user/:id", authentication, authorization, deleteUserSoft);

//only admin can get all user
userRouter.get("/all", authentication, authorization, getAllUser);

//reset password
userRouter.post('/forgotpassword',forgetPassword)
// userRouter.post('/passwordreset',passwordReset)
userRouter.post('/resetpassword/:id/:token', resetPassword)
// userRouter.post('/resetpassword',passwordUpdated)

// Google passport

userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    res.end(popuptools.popupResponse(req.user));
  }
);

// /passport/google




userRouter.post(
  "/googleLoggin",googleLogin
);
module.exports = userRouter;
