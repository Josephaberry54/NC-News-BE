const { Article, Comment, User } = require("../models/models");
// const Promise = require("bluebird");

function getAllArticles(req, res, next) {
  Article.find()
    .populate("belongs_to")
    .populate("created_by", "username _id")
    .then(articles => {
      const commentCounts = articles.map(article => {
        return Comment.find({ belongs_to: article._id }).count();
      });
      return Promise.all([articles, ...commentCounts]);
    })
    .then(([articles, ...counts]) => {
      return articles.map((article, i) => {
        return {
          title: article.title,
          body: article.body,
          belongs_to: article.belongs_to,
          created_by: article.created_by,
          votes: article.votes,
          comments: counts[i],
          _id: article._id,
          __v: article.__v
        };
      });
    })
    .then(articles => res.json({ articles }))
    .catch(next);
}

function getCommentsByArticleId(req, res, next) {
  const { article_id } = req.params;
  Comment.find({ belongs_to: article_id })
    .populate("belongs_to")
    .populate("created_by")
    .then(comments => res.json({ comments }))
    .catch(next);
}

function postACommentByArticleId(req, res, next) {
  const { article_id } = req.params;
  const { comment } = req.body;
  User.findOne()
    .then(user => {
      const newComment = new Comment({
        body: comment,
        belongs_to: article_id,
        created_by: user._id
      });
      return newComment.save();
    })
    .then(commentDoc => {
      res.status(201).json({ commentDoc });
    })
    .catch(next);
}

function voteOnAnArticle(req, res, next) {
  const { vote } = req.query;
  const { article_id } = req.params;

  let value;
  if (vote === "up") {
    value = 1;
  } else if (vote === "down") {
    value = -1;
  } else {
    next();
  }

  return Article.findByIdAndUpdate(
    article_id,
    { $inc: { votes: value } },
    { new: true }
  )
    .populate("belongs_to")
    .populate("created_by")
    .then(article => res.send(article))
    .catch(next);
}

module.exports = {
  getAllArticles,
  getCommentsByArticleId,
  postACommentByArticleId,
  voteOnAnArticle
};
