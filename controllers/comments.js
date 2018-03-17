const { Comment } = require("../models/models");

function voteOnAComment(req, res, next) {
  const { vote } = req.query;
  const { comment_id } = req.params;
  let value;
  if (vote === "up") value = 1;
  if (vote === "down") value = -1;

  return Comment.findOneAndUpdate(
    { _id: comment_id },
    { $inc: { votes: value } },
    { new: true }
  ).then(comment =>
    res.json({
      comment
    })
  );
}

function deleteCommentById(req, res, next) {
  const { comment_id } = req.params;
  return Comment.findOneAndRemove({ _id: comment_id }, { new: false }).then(
    deletedComment => res.json({ deletedComment })
  );
}

module.exports = { voteOnAComment, deleteCommentById };
