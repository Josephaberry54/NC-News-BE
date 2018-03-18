const { Comment } = require("../models/models");

function voteOnAComment(req, res, next) {
  const { vote } = req.query;
  const { comment_id } = req.params;
  let value;
  vote === "up" ? (value = 1) : vote === "down" ? (value = -1) : value;

  return Comment.findOneAndUpdate(
    { _id: comment_id },
    { $inc: { votes: value } },
    { new: true }
  )
    .then(comment =>
      res.json({
        comment
      })
    )
    .catch(next);
}

function deleteCommentById(req, res, next) {
  const { comment_id } = req.params;
  return Comment.findOneAndRemove({ _id: comment_id }, { new: false })
    .then(deletedComment => {
      if (!deletedComment) return next({ message: "no such comment" });
      res.json({ deletedComment });
    })
    .catch(next);
}

module.exports = { voteOnAComment, deleteCommentById };
