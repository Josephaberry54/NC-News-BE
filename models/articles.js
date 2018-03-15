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
    references: user,
    required: true
  },
  votes: {
    type: Number,
    required: true,
    default: 0
  },
  written_by: {
    type: mongoose.Schema.Types.ObjectId,
    references: user,
    required: true
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comments"
    }
  ]
});

module.exports = mongoose.model("articles", ArticleSchema);
