import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import Score from "../models/Score";
import LeaderBoard from "../models/Leaderboard";
import Leaderboard from "../models/Leaderboard";

/**
 * DATABASE SETUP
 */
const mongoConnectionURL =
  "mongodb+srv://awhipp:wrsnmmIsGhRizTbi@empirica.inpamgh.mongodb.net/?retryWrites=true&w=majority";
const databaseName = "empirica";
mongoose
  .connect(mongoConnectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: databaseName,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(`Error connecting to MongoDB: ${err}`));

/**
 * CUSTOM API SETUP
 */
const PORT = 3001;
const app = express();
app.use(cors());
app.use(express.json());

app.get("/leaderboard", async (req, res) => {
  await Leaderboard.findOne({ gameid: req.query.gameid })
    .then(async (leaderboard) => {
      const scores = [];
      for (const scoreId of leaderboard.scores) {
        await Score.findById(scoreId).then(async (score) => {
          scores.push(score);
        });
      }
      res.send({ scores: scores });
    })
    .catch((err) => {});
});

const initLeaderboard = async (game) => {
  const scoreIds = [];
  for (const player of game.players) {
    const newScore = new Score({
      gameid: game.id,
      playerid: player.get("participantIdentifier"),
      role: player.get("role") === "consumer" ? "CONSUMER" : "PRODUCER",
      score: 0,
    });
    await newScore
      .save()
      .then(async (score) => {
        scoreIds.push(score._id.toString());
      })
      .catch((err) => {});
  }

  const leaderboard = new Leaderboard({
    date: new Date().toLocaleTimeString(),
    gameid: game.id,
    scores: scoreIds,
  });
  await leaderboard
    .save()
    .then((newBoard) => {
      console.log(`Leaderboard initialized: ${newBoard._id}`);
    })
    .catch((err) => {});

  // start listening for leaderboard requests
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

// Function to update the score of consumers
async function updateConsumerScores(game) {
  await game.players.forEach(async (player) => {
    if (player.get("role") === "consumer") {
      const basket = player.round.get("basket") || {};
      let score = player.get("score") || 0;

      Object.entries(basket).forEach(([productId, quantity]) => {
        const producer = game.players.find((p) => p.id === productId);
        if (producer) {
          const productQuality = producer.round.get("productQuality");
          const points = productQuality === "high" ? 10 : 5;
          score += points * quantity;
        }
      });

      player.set("score", score);

      const body = {
        gameid: game.id,
        playerid: player.get("participantIdentifier"),
        role: "CONSUMER",
      };
      await Score.findOneAndUpdate(
        body,
        { score: score },
        { upsert: true, new: true }
      ).then((updatedScore) => {
        console.log(
          `Leaderboard updated for consumer ${updatedScore.playerid}: ${updatedScore.score}`
        );
      });
    }
  });
}

// Function to process consumer baskets and create a map of units sold
function processConsumerBaskets(game) {
  const unitsSoldMap = new Map();
  game.players.forEach((player) => {
    if (player.get("role") === "consumer") {
      const basket = player.round.get("basket") || {};
      Object.entries(basket).forEach(([producerId, quantity]) => {
        unitsSoldMap.set(
          producerId,
          (unitsSoldMap.get(producerId) || 0) + quantity
        );
      });
    }
  });

  return unitsSoldMap;
}

// Function to update the score of producers
async function updateProducerScores(game, unitsSoldMap) {
  await game.players.forEach(async (player) => {
    if (player.get("role") === "producer") {
      const producerId = player.id;
      const unitsSold = unitsSoldMap.get(producerId) || 0;
      const productPrice = player.round.get("productPrice");
      const productCost = player.round.get("productCost");
      const profit = unitsSold * (productPrice - productCost);
      const capital = player.round.get("capital");
      player.round.set("unitsSold", unitsSold);
      player.set("score", capital + profit);

      const body = {
        gameid: game.id,
        playerid: player.get("participantIdentifier"),
        role: "PRODUCER",
      };
      await Score.findOneAndUpdate(
        body,
        { score: player.get("score") },
        { upsert: true, new: true }
      ).then((updatedScore) => {
        console.log(
          `Leaderboard updated for producer ${updatedScore.playerid}: ${updatedScore.score}`
        );
      });
    }
  });
}

// Function to assign roles to players
function assignRoles(game) {
  const treatment = game.get("treatment");
  const producerPercentage = treatment.producerPercentage;
  const players = game.players;
  const numberOfProducers = Math.round(producerPercentage * players.length);

  const shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
  shuffledPlayers.forEach((player, index) => {
    const role = index < numberOfProducers ? "producer" : "consumer";
    player.set("role", role);
  });
}

Empirica.onGameStart(async ({ game }) => {
  const round = game.addRound({ name: `Round` });
  round.addStage({ name: "selectRoleStage", duration: 24000 });
  round.addStage({ name: "claimsStage", duration: 24000 });
  round.addStage({ name: "choiceStage", duration: 24000 });
  round.addStage({ name: "feedbackStage", duration: 24000 });
  round.addStage({ name: "scoreboardStage", duration: 24000 });
  //deliberate stage for future versions

  game.players.forEach((player) => player.set("score", 0));
  assignRoles(game);

  await initLeaderboard(game);
});

Empirica.onStageEnded(({ stage }) => {
  if (stage.get("name") === "choiceStage") {
    const unitsSoldMap = processConsumerBaskets(stage.currentGame);
    updateProducerScores(stage.currentGame, unitsSoldMap);
    updateConsumerScores(stage.currentGame);
  }
});

Empirica.onGameEnded(({ game }) => {});
