const mongoose = require("mongoose");

const ScoreSchema = new mongoose.Schema({
  identifier: String,
  score: Number,
});

module.exports = mongoose.model("score", ScoreSchema);
