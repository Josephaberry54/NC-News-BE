const { Article, Comment, User } = require("../models/models");

function getAllArticles(req, res, next) {
  Article.find().then(articles => res.json({ articles }));
}

function getCommentsByArticleId(req, res, next) {
  const { article_id } = req.params;
  Comment.find({ belongs_to: article_id }).then(comments =>
    res.json({ comments })
  );
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
    .then(commentDoc => res.status(201).json({ commentDoc }));
}

function voteOnAnArticle(req, res, next) {
  const { vote } = req.query;
  const { article_id } = req.params;
  let value;
  if (vote === "up") value = 1;
  if (vote === "down") value = -1;

  return Article.findOneAndUpdate(
    { _id: article_id },
    { $inc: { votes: value } },
    { new: true }
  ).then(article => res.send({ article }));
}

module.exports = {
  getAllArticles,
  getCommentsByArticleId,
  postACommentByArticleId,
  voteOnAnArticle
};
