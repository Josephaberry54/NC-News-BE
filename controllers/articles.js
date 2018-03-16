const { Article } = require("../models/models");

function getAllArticles(req, res, next) {
  Article.find().then(articles => res.json({ articles }));
}

function getCommentsByArticleId(req, res, next) {}

module.exports = { getAllArticles, getCommentsByArticleId };
