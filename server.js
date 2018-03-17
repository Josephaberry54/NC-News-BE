if (!process.env.NODE_ENV) process.env.NODE_ENV = "dev";
const DB =
  process.env.NODE_ENV === "production"
    ? process.env.DB_URL
    : require("./config").DB[process.env.NODE_ENV];

const app = require("express")();
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const bodyParser = require("body-parser");
const apiRouter = require("./routers/api");

mongoose
  .connect(DB, { useMongoClient: true })
  .then(() => console.log("successfully connected to", DB))
  .catch(err => console.log("connection failed", err));

app.use(bodyParser.json());

app.use("/api", apiRouter);

module.exports = app;
