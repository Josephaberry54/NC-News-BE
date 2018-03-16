const articlesRouter = require("express").Router();
const {
  getAllArticles,
  getCommentsByArticleId
} = require("../controllers/articles");

articlesRouter.route("/").get(getAllArticles);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post();

articlesRouter.route("/:article_id").put();

module.exports = articlesRouter;
