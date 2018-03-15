var { User, Topic, Article, Comment, Model } = require("../models/models");
const { DB, PORT } = require("../config");
var mongoose = require("mongoose");
mongoose.Promise = Promise;
const util = require("util");
const fs = require("fs");
const parse = require("csv-parse");

const promiseFs = util.promisify(fs.readFile);
const promiseParse = util.promisify(parse);

function seedUsers() {
  return promiseFs(`${__dirname}/data/users.csv`, "utf8").then(file =>
    promiseParse(file, { columns: true }).then(users => User.insertMany(users))
  );
}

function seedTopics() {
  return promiseFs(`${__dirname}/data/topics.csv`, "utf8").then(file =>
    promiseParse(file, { columns: true }).then(topics =>
      Topic.insertMany(topics)
    )
  );
}

function seedArticles() {
  return promiseFs(`${__dirname}/data/topics.csv`, "utf8").then(file =>
    promiseParse(file, { columns: true })
      .then(articles => articles.map(article => {}))
      .then(articles => Article.insertMany(articles))
  );
}

// This should seed your development database using the CSV file data
// Feel free to use the async library, or native Promises, to handle the asynchronicity of the seeding operations.

function seedDatabase(DB_URL) {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log("Database connected!");
      return mongoose.connection.db.dropDatabase();
    })
    .then(() => {
      console.log("dropped database!");
      return seedTopics();
    })
    .then(topics => {
      console.log(topics);
      console.log("saved topics!");
      return seedUsers();
    })
    .then(users => {
      console.log("saved users!");
      //return seedArticles();
    });
  // .then(articles => {
  //   console.log("saved articles!");
  //   // mongoose.disconnect();
  // });
}

seedDatabase(DB.dev);
