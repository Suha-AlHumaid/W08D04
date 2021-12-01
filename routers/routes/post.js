const express = require("express");
const postRouter = express.Router();

// authentication middelle wear
const authentication = require("../auth/authentication");

//destructuring
const {
  getAllPosts,
  getPost,
  addPost,
  deletePost,
  updatePost,
} = require("../controllers/post");

//controllers
postRouter.get("/posts", authentication, getAllPosts);
postRouter.get("/post/:id", authentication, getPost);
postRouter.post("/post", authentication, addPost);
postRouter.delete("/post/:_id", authentication, deletePost);
postRouter.put("/post/:_id", authentication, updatePost);

module.exports = postRouter;
