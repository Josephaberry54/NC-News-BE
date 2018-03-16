const { Topic, Article } = require("../models/models");

function getAllTopics(req, res, next) {
  return Topic.find().then(topics => res.json({ topics }));
}

function getArticlesByTopic(req, res, next) {
  const { topic_id } = req.params;
  return Article.find({ belongs_to: topic_id }).then(articles => {
    res.json({ articles });
  });
}

module.exports = { getAllTopics, getArticlesByTopic };
