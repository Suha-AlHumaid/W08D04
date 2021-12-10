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
  getAllUser,verify
} = require("../controllers/user");

//controllers
userRouter.post("/register", register);

userRouter.post("/login", login);

//only admin can delete
userRouter.delete("/user/:id", authentication, authorization, deleteUser);

//only admin can delete soft
userRouter.put("/user/:id", authentication, authorization, deleteUserSoft);

//only admin can get all user
userRouter.get("/all", authentication, authorization, getAllUser);
userRouter.get('/verify/:token', verify);
module.exports = userRouter;
