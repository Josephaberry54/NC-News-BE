const { Topic } = require("../models/models");

function getAllTopics(req, res, next) {
  return Topic.find().then(topics => res.json({ topics }));
}

module.exports = { getAllTopics };
