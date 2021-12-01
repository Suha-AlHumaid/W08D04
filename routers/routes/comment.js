const express = require("express");
const commentRouter = express.Router();

// authentication middelle wear
const authentication = require("../auth/authentication");
// authentication middelle wear
const authorization = require("../auth/authorization");

//destructuring
const {
  getAllComments,
  getComment,
  addComment,
  deleteComment,
  updateComment,
  deleteAnyCommentOrPost,
  deleteCommentOfUserPost,
} = require("../controllers/comment");

//controllers
commentRouter.get("/comments/:_id", authentication, getAllComments);
commentRouter.get("/comment/:id", authentication, getComment);
commentRouter.post("/comment/:_id", authentication, addComment);
commentRouter.delete("/comment/:_id", authentication, deleteComment);
commentRouter.put("/comment/:_id", authentication, updateComment);
commentRouter.put(
  "/deleteCommentOfUserPost/:_id",
  authentication,
  deleteCommentOfUserPost
);
commentRouter.delete(
  "/anyCommentOrpost",
  authentication,
  authorization,
  deleteAnyCommentOrPost
);

module.exports = commentRouter;
