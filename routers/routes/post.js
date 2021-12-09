const express = require("express");
const postRouter = express.Router();

// authentication middelle wear
const authentication = require("../auth/authentication");
// authentication middelle wear
const authorization = require("../auth/authorization");

//destructuring
const {
  getAllPosts,
  getPost,
  addPost,
  deletePost,
  updatePost,
  allPosts

} = require("../controllers/post");

//controllers
postRouter.get("/allPosts", allPosts);
postRouter.get("/posts", authentication, getAllPosts);
postRouter.get("/post/:id", authentication, getPost);
postRouter.post("/post", authentication, addPost);
postRouter.put("/DelePost/:_id", authentication, deletePost);
postRouter.put("/post/:_id", authentication, updatePost);

module.exports = postRouter;
