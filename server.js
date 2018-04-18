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
const morgan = require("morgan");
const cors = require("cors");

mongoose
  .connect(DB, { useMongoClient: true })
  .then(() => console.log("successfully connected to", DB))
  .catch(err => console.log("connection failed", err));

app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());
app.use(morgan("dev"));

app.use("/api", apiRouter);

app.use("/*", (req, res, next) =>
  res.status(404).json({ message: "page not found" })
);

app.use((err, req, res, next) => {
  if (err.name === "CastError" || err.name === "ValidationError")
    return res.status(400).json({
      message: "invalid input"
    });
  next(err);
});

app.use((err, req, res, next) => {
  if (err.message === "no such comment")
    return res.status(400).json({
      message: err.message
    });
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status === 400)
    return res.status(400).json({
      message: "bad request"
    });
  next(err);
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: "internal server error" });
});

module.exports = app;
