const { Topic } = require("../models/models");

function getAllTopics(req, res, next) {
  return Topic.find().then(topics => res.json({ topics }));
}

function getArticlesByTopic(req, res, next) {}

module.exports = { getAllTopics, getArticlesByTopic };
