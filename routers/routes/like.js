const express = require("express");
const likeRouter = express.Router();

// authentication middelle wear
const authentication = require("../middlewares/authentication");

const { likeToggele } = require("../controllers/like");

likeRouter.put("/like/:id", authentication, likeToggele);
module.exports = likeRouter;
