const usersRouter = require("express").Router();
const { getUserByUserId } = require("../controllers/users");

usersRouter.route("/:user_id").get(getUserByUserId);

module.exports = usersRouter;
