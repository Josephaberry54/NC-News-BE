const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  belongs_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "topic",
    required: true
  },
  votes: {
    type: Number,
    default: 0
  },
  created_by: {
    type: Object,
    required: true,
    default: { name: "northcoder" }
  }
});

module.exports = mongoose.model("articles", ArticleSchema);
