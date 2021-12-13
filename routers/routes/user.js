const express = require("express");
const userRouter = express.Router();

// authentication middelle wear
const authentication = require("../auth/authentication");
// authentication middelle wear
const authorization = require("../auth/authorization");

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

module.exports = userRouter;
