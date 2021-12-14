const express = require("express");
const likeRouter = express.Router();

// authentication middelle wear
const authentication = require("../middlewares/authentication");

const { likeToggele ,getLikes } = require("../controllers/like");

likeRouter.get("/likes/:id", getLikes);
likeRouter.put("/like/:id", authentication, likeToggele);
module.exports = likeRouter;
