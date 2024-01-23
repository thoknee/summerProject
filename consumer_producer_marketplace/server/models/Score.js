const mongoose = require("mongoose");

const ScoreSchema = new mongoose.Schema({
  gameid: String,
  playerid: String,
  role: String,
  score: Number,
});

module.exports = mongoose.model("score", ScoreSchema);
