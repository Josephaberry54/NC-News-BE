const articlesRouter = require("express").Router();
const {
  getAllArticles,
  getCommentsByArticleId,
  postACommentByArticleId,
  voteOnAnArticle
} = require("../controllers/articles");

articlesRouter.route("/").get(getAllArticles);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postACommentByArticleId);

articlesRouter.route("/:article_id").put(voteOnAnArticle);

module.exports = articlesRouter;
