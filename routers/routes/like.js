const express = require("express");
const likeRouter = express.Router();

// authentication middelle wear
const authentication = require("../auth/authentication");
// authentication middelle wear
const authorization = require("../auth/authorization");

const {likeToggele, addLike} = require("../controllers/like");
likeRouter.post("/like/:_id", authentication, addLike);
likeRouter.put("/like/:_id", authentication, likeToggele);

module.exports=likeRouter;