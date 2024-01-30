import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();

// Function to update the score of consumers
async function updateConsumerScores(game) {
  await game.players.forEach(async (player) => {
    if (player.get("role") !== "consumer") return;
    const basket = player.round.get("basket") || {};
    let score = player.get("score") || 0;
    Object.entries(basket).forEach(([productId, quantity]) => {
      const producer = game.players.find((p) => p.id === productId);
      if (producer) {
        const productQuality = producer.round.get("productQuality");
        const productPrice = producer.round.get("productPrice");
        // TODO: Remove hardcoded values
        const points = productQuality === "high" ? 10 : 5;
        score += quantity * (points - productPrice);
      }
    });
    player.set("score", score);
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
      let score = player.get("score") || 0;
      score += (capital + profit);
      console.log(capital + profit);
      console.log(score);
      player.set("score", score);
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
  // TODO: Remove hardcoded values
  const numRounds = 5;
  for (let roundNumber = 1; roundNumber <= numRounds; roundNumber++) {
    const round = game.addRound({ name: `Round${roundNumber}` });
    round.addStage({ name: "selectRoleStage", duration: 24000 });
    round.addStage({ name: "qualityStage", duration: 24000 });
    round.addStage({ name: "claimsStage", duration: 24000 });
    round.addStage({ name: "choiceStage", duration: 24000 });
    round.addStage({ name: "feedbackStage", duration: 24000 });
    round.addStage({ name: "scoreboardStage", duration: 24000 });
  }

  game.players.forEach((player) => player.set("score", 0));
  assignRoles(game);
});

Empirica.onStageEnded(({ stage }) => {
  if (stage.get("name") === "choiceStage") {
    const unitsSoldMap = processConsumerBaskets(stage.currentGame);
    updateProducerScores(stage.currentGame, unitsSoldMap);
    updateConsumerScores(stage.currentGame);
  }
});

Empirica.onGameEnded(({ game }) => {});
