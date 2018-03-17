const commentsRouter = require("express").Router();
const {
  voteOnAComment,
  deleteCommentById
} = require("../controllers/comments");

commentsRouter
  .route("/:comment_id")
  .put(voteOnAComment)
  .delete(deleteCommentById);

module.exports = commentsRouter;
