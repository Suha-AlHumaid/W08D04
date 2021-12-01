const express = require("express");
const likeRouter = express.Router();

// authentication middelle wear
const authentication = require("../auth/authentication");
// authentication middelle wear
const authorization = require("../auth/authorization");

const {likeToggele} = require("../controllers/like");

likeRouter.put("/like/:id", authentication,likeToggele);
module.exports=likeRouter;