const mongoose = require("mongoose");

const LeaderboardSchema = new mongoose.Schema({
  date: String,
  gameid: String,
  scores: [String], // array of Score IDs
});

module.exports = mongoose.model("leaderboard", LeaderboardSchema);
