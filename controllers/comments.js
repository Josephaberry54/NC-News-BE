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
    res.send({
      comment
    })
  );
}

module.exports = { voteOnAComment };
