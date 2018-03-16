if (!process.env.NODE_ENV) process.env.NODE_ENV = "dev";

var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();
var DB =
  process.env.NODE_ENV === "production"
    ? process.env.DB_URL
    : require("./config").DB[process.env.NODE_ENV];

mongoose.Promise = Promise;
const apiRouter = require("./routers/api");

mongoose
  .connect(DB, { useMongoClient: true })
  .then(() => console.log("successfully connected to", DB))
  .catch(err => console.log("connection failed", err));

app.use(bodyParser.json());

app.use("/api", apiRouter);

module.exports = app;
