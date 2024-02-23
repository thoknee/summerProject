import { ClassicListenersCollector } from "@empirica/core/admin/classic";

export const Empirica = new ClassicListenersCollector();

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
    const capital = player.get("capital");
    const stock = player.get("stock");
    const round = player.round.get("round")
    const currentStock = stock.find((item) => item.round === round);
    const soldStock = currentStock.soldStock;
    const productPrice = currentStock.productPrice;
    const productCost = currentStock.productCost;
    // const profit = productPrice - productCost;
    const initialStock = currentStock.initialStock;
    const totalCost = initialStock * productCost;
    const totalSales = soldStock * productPrice;
    const originalScore = player.get("score") || 0;
    let score = player.get("score") || 0;
    score += (totalSales - totalCost);
    player.set("score", score);
    player.set("scoreDiff", score - originalScore);
    player.set("capital", capital + totalSales);
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
    round.addStage({ name: "stockStage", duration: 24000 });
    round.addStage({ name: "choiceStage", duration: 24000 });
    round.addStage({ name: "feedbackStage", duration: 24000 });
    round.addStage({ name: "scoreboardStage", duration: 24000 });
  }

  game.players.forEach((player) => {
    player.set("score", 0);
  });
  assignRoles(game);
});

Empirica.onStageEnded(({ stage }) => {
  switch (stage.get("name")) {
    case "choiceStage":
      updateProducerScores(stage.currentGame);
      updateConsumerScores(stage.currentGame);
      break;
  }
});

Empirica.onGameEnded(({ game }) => { });
