const { Topic, Article, Comment } = require("../models/models");
const Promise = require("bluebird");

function getAllTopics(req, res, next) {
  return Topic.find()
    .then(topics => res.json({ topics }))
    .catch(next);
}

function getArticlesByTopic(req, res, next) {
  const { topic_id } = req.params;
  return Article.find({ belongs_to: topic_id })
    .then(articles => {
      return Promise.map(articles, article => {
        commentCount = Comment.count({ belongs_to: article._id }).exec();
        return Promise.all([article, commentCount]).then(
          ([article, commentCount]) => {
            return { ...article._doc, comments: commentCount };
          }
        );
      });
    })
    .then(articles => res.json({ articles }))
    .catch(next);
}

module.exports = { getAllTopics, getArticlesByTopic };
