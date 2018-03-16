const topicsRouter = require("express").Router();
const { getAllTopics, getArticlesByTopic } = require("../controllers/topics");

topicsRouter.route("/").get(getAllTopics);

topicsRouter.route("/:topic_id/articles").get(getArticlesByTopic);

module.exports = topicsRouter;
