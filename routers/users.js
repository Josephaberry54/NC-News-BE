const usersRouter = require("express").Router();
const {} = require("../controllers/users");

usersRouter.route("/:username").get();

usersRouter.route("/:username/repos").get();

module.exports = usersRouter;
