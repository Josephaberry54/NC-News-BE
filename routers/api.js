const apiRouter = require("express").Router();
const {
  articlesRouter,
  topicsRouter,
  usersRouter,
  commentsRouter
} = require("./index");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
