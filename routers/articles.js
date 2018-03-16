const articlesRouter = require("express").Router();
const {} = require("../controllers/articles");

articlesRouter.route("/").get();

articlesRouter
  .route("/:article_id/comments")
  .get()
  .post();

articlesRouter.route("/:article_id").put();

module.exports = articlesRouter;
