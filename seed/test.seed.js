const { User, Comment, Topic, Article } = require("../models/models");
const { DB, PORT } = require("../config");
const mongoose = require("mongoose");
mongoose.Promise = Promise;

const savedData = {};

function saveUser() {
  const user = new User({
    username: "northcoder",
    name: "Awesome Northcoder",
    avatar_url: "https://avatars3.githubusercontent.com/u/6791502?v=3&s=200"
  });
  return user.save();
}

function saveTopics() {
  const topics = [
    { title: "Football", slug: "football" },
    { title: "Cooking", slug: "cooking" },
    { title: "Cats", slug: "cats" }
  ].map(t => new Topic(t).save());
  return Promise.all(topics);
}

function saveArticles(user, topics) {
  const articles = [
    {
      title: "Cats are great",
      body: "something",
      belongs_to: topics[2]._id,
      created_by: user._id
    },
    {
      title: "Football is fun",
      body: "something",
      belongs_to: topics[0]._id,
      created_by: user._id
    }
  ].map(a => new Article(a).save());
  return Promise.all(articles);
}

function saveComments(user, topics, articles) {
  const comments = [
    {
      body: "this is a comment",
      belongs_to: articles[0]._id,
      created_by: user._id
    },
    {
      body: "this is another comment",
      belongs_to: articles[1]._id,
      created_by: user._id
    }
  ].map(c => new Comment(c).save());
  return Promise.all(comments);
}

function saveTestData(DB_URL) {
  return mongoose
    .connect(DB_URL, { useMongoClient: true })
    .then(() => {
      // console.log("connected to test database");
      return mongoose.connection.db.dropDatabase();
    })
    .then(() => {
      //console.log("dropped test database");
      return saveUser();
    })
    .then(user => {
      savedData.user = user;
      return Promise.all([user, saveTopics()]);
    })
    .then(([user, topics]) => {
      savedData.topics = topics;
      return Promise.all([user, topics, saveArticles(user, topics)]);
    })
    .then(([user, topics, articles]) => {
      savedData.articles = articles;
      return saveComments(user, topics, articles);
    })
    .then(comments => {
      savedData.comments = comments;
      return savedData;
    });
}

module.exports = saveTestData;
