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
  passwordReset,
  resetPassword,
  passwordUpdated
} = require("../controllers/user");

//controllers
userRouter.post("/register", register);

userRouter.post("/login", login);

//only admin can delete
// userRouter.delete("/user/:id", authentication, authorization, deleteUser);

//only admin can delete soft
userRouter.delete("/user/:id", authentication, authorization, deleteUserSoft);

//only admin can get all user
userRouter.get("/all", authentication, authorization, getAllUser);
userRouter.get('/verify/:token', verify);
userRouter.get('/forgotpassword',forgetPassword)
userRouter.post('/passwordreset',passwordReset)
userRouter.get('/resetpassword/:id/:token', resetPassword)
userRouter.post('/resetpassword',passwordUpdated)
module.exports = userRouter;
