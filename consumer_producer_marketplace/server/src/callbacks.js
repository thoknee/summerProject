import { ClassicListenersCollector } from "@empirica/core/admin/classic";

export const Empirica = new ClassicListenersCollector();

async function updateProducerClaimScores(game) {
  await game.players.forEach(async (player) => {
    if (player.get("role") !== "producer") return;
    const claims = player.get("claims");
    const round = player.round.get("round")
    const currentClaims = claims.find((item) => item.round === round);
    let capital = player.get("capital");
    const warrants = player.get("warrants")
    const currentWarrants = warrants.find((item) => item.round === round);
    const warrantAdded = currentWarrants.warrantAdded;
    let scoreDiff = player.get("scoreDiff")
    let score = player.get("score")
    let oldScore = player.get("score")
    const warrantPrice = currentWarrants.warrantPrice;
    if (warrantAdded == true && currentClaims.status === true && currentClaims.claim === false) {
      return
    }
    else if (warrantAdded == true && currentClaims.status === true && currentClaims.claim === true) {
      score += warrantPrice
      capital += warrantPrice;
      player.set("capital", capital);
      player.set("score", score)
      player.set("scoreDiff", scoreDiff + score - oldScore)
      return;
    }
    else if (warrantAdded == true && currentClaims.status === false) {
      score += warrantPrice
      capital += warrantPrice;
      player.set("capital", capital);
      player.set("score", score)
      player.set("scoreDiff", scoreDiff + score - oldScore)
      return;
    }
    else {
      return;
    }
  });
}

async function updateConsumerClaimScores(game) {
  await game.players.forEach(async (player) => {
    if (player.get("role") !== "consumer") return;
    const challenges = player.get("challenges");
    const round = player.round.get("round")
    const warrantPrice = player.round.get("warrantPrice");
    const currentChallenges = challenges.find((item) => item.round === round);
    const challengeAmount = player.round.get("challengeAmount")
    let scoreDiff = player.get("scoreDiff")
    let score = player.get("score")
    let oldScore = player.get("score")
    let wallet = player.get("wallet");
    if (currentChallenges.status === true && currentChallenges.challenge === true) {
      wallet += warrantPrice;
      score += warrantPrice;
      player.set("score", score)
      player.set("scoreDiff", scoreDiff + score - oldScore)
      player.set("wallet", wallet);
      return
    }
    else if (currentChallenges.status === true && currentChallenges.challenge === false) {
      score -= challengeAmount;
      player.set("score", score)
      player.set("scoreDiff", scoreDiff + score - oldScore)
      return;
    }
    else if (currentChallenges.status === false) {
      return;
    }
    else {
      return;
    }
  });
}

// Function to update the score of consumers
async function updateConsumerScores(game) {
  await game.players.forEach(async (player) => {
    if (player.get("role") !== "consumer") return;
    const basket = player.get("basket");
    const wallet = player.get("wallet");
    const round = player.round.get("round")

    const originalScore = player.get("score") || 0;
    let score = player.get("score") || 0;
    basket.forEach((item) => {
      if (item.round === round) {
        score += (item.value - item.productPrice) * item.quantity;
      }
    });
    player.set("score", score);
    player.set("scoreDiff", score - originalScore);
  });
}

// Function to update the score of producers
async function updateProducerScores(game) {
  await game.players.forEach(async (player) => {
    if (player.get("role") !== "producer") return;
    const stock = player.get("stock");
    const round = player.round.get("round")
    const currentStock = stock.find((item) => item.round === round);
    const soldStock = currentStock.soldStock;
    const productPrice = currentStock.productPrice;
    const productCost = currentStock.productCost;
    const profit = productPrice - productCost;
    const originalScore = player.get("score") || 0;
    let score = player.get("score") || 0;
    score += (profit * soldStock);
    player.set("score", score);
    player.set("scoreDiff", score - originalScore);
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
  // TODO: Remove hardcoded values
  const numRounds = 5;
  for (let roundNumber = 1; roundNumber <= numRounds; roundNumber++) {
    const round = game.addRound({ name: `Round${roundNumber}` });
    round.addStage({ name: "selectRoleStage", duration: 24000 });
    round.addStage({ name: "qualityStage", duration: 24000 });
    round.addStage({ name: "claimsStage", duration: 24000 });
    round.addStage({ name: "choiceStage", duration: 24000 });
    round.addStage({ name: "feedbackStage", duration: 24000 });
    round.addStage({ name: "deliberateStage", duration: 24000 });
    round.addStage({ name: "scoreboardStage", duration: 24000 });
  }

  game.players.forEach((player) => {
    player.set("score", 0);
  });
  assignRoles(game);
});

Empirica.onStageEnded(({ stage }) => {
  if (stage.get("name") === "choiceStage") {
    updateProducerScores(stage.currentGame);
    updateConsumerScores(stage.currentGame);
  }
  if (stage.get("name") === "feedbackStage") {
    updateProducerClaimScores(stage.currentGame);
    updateConsumerClaimScores(stage.currentGame);
  }
});

Empirica.onGameEnded(({ game }) => { });