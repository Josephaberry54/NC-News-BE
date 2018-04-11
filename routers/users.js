const usersRouter = require("express").Router();
const { getUserByUserId, getAllUsers } = require("../controllers/users");

usersRouter.route("/:user_id").get(getUserByUserId);

usersRouter.route("/users").get(getAllUsers);

module.exports = usersRouter;
