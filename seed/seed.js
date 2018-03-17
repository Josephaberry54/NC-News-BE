const { User, Topic, Article, Comment, Model } = require("../models/models");
const DB =
  process.env.NODE_ENV === "production"
    ? process.env.DB_URL
    : require("../config").DB[process.env.NODE_ENV];

const mongoose = require("mongoose");
mongoose.Promise = Promise;
const { promisify } = require("util");
const fs = require("fs");
const parse = require("csv-parse");
const faker = require("faker/locale/it");

const promiseFs = promisify(fs.readFile);
const promiseParse = promisify(parse);

// users and topics can be the same function with the path and the model passed in

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

function seedArticles(topicData, userData) {
  return promiseFs(`${__dirname}/data/articles.csv`, "utf8").then(file => {
    return promiseParse(file, { columns: true })
      .then(articles =>
        articles.map(article => {
          article.belongs_to = topicData.find(
            element => element.slug === article.belongs_to
          )._id;
          article.created_by =
            userData[Math.floor(Math.random() * userData.length)];
          return article;
        })
      )
      .then(articles => Article.insertMany(articles));
  });
}

function seedComments(topicDate, userData, articleData) {
  const comments = [];
  for (let i = 0; i < 10; i++) {
    comments.push(
      new Comment({
        body: faker.random.words(),
        belongs_to: articleData[Math.floor(Math.random() * articleData.length)],
        created_by: userData[Math.floor(Math.random() * userData.length)]
      })
    );
  }
  return Comment.insertMany(comments);
}

// rather than mutating the article write const newArticle = {...article, created_by: <randomuserid>}
//could use lodash sample to generate a random user etc

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
      console.log("saved topics!");
      return Promise.all([topics, seedUsers()]);
    })
    .then(([topics, users]) => {
      console.log("saved users!");
      return Promise.all([topics, users, seedArticles(topics, users)]);
    })
    .then(([topics, users, articles]) => {
      console.log("saved articles!");
      return seedComments(topics, users, articles);
    })
    .then(comments => {
      console.log("seeded comments!");
      return mongoose.disconnect();
    });
}

seedDatabase(DB[process.env.NODE_ENV]);
