const express = require("express");
const postRouter = express.Router();

// authentication middelle wear
const authentication = require("../middlewares/authentication");
// authentication middelle wear
const authorization = require("../middlewares/authorization");

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
postRouter.get("/allPosts", authentication, allPosts);
postRouter.get("/posts", authentication, getAllPosts);
postRouter.get("/post/:id", authentication, getPost);
postRouter.post("/post", authentication, addPost);
postRouter.delete("/DelePost/:_id", authentication, deletePost);
postRouter.put("/post/:_id", authentication, updatePost);

module.exports = postRouter;
