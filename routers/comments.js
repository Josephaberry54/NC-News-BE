const commentsRouter = require("express").Router();
const { voteOnAComment } = require("../controllers/comments");

commentsRouter.route("/:comment_id").put(voteOnAComment);
//.delete();

module.exports = commentsRouter;
