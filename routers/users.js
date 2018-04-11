const usersRouter = require("express").Router();
const { getUserByUserId, getAllUsers } = require("../controllers/users");

usersRouter.route("/all").get(getAllUsers);

usersRouter.route("/:user_id").get(getUserByUserId);

module.exports = usersRouter;
