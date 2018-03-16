const { Article, Comment } = require("../models/models");

function getAllArticles(req, res, next) {
  Article.find().then(articles => res.json({ articles }));
}

function getCommentsByArticleId(req, res, next) {
  const { article_id } = req.params;
  Comment.find({ belongs_to: article_id }).then(comments =>
    res.json({ comments })
  );
}

function postACommentByArticleId(req, res, next) {}

module.exports = {
  getAllArticles,
  getCommentsByArticleId,
  postACommentByArticleId
};
