const express = require("express");
const roleRouter = express.Router();

//destructuring
const { createRole, getAllRoles } = require("../controllers/role");

// authentication middelle wear
const authentication = require("../middlewares/authentication");
// authentication middelle wear
const authorization = require("../middlewares/authorization");

//controllers
//only admin can create a role
// authentication, authorization,
roleRouter.post("/createRole", authentication, authorization, createRole);
//only admin can create show roles
roleRouter.get("/getAllRoles", authentication, authorization, getAllRoles);

module.exports = roleRouter;
