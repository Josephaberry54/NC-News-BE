const commentsRouter = require("express").Router();
const {} = require("../controllers/comments");

commentsRouter
  .route("/:comment_id")
  .put()
  .delete();

module.exports = commentsRouter;
