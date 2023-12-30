import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();

// Function to update the score of consumers
function updateConsumerScores(stage) {
  stage.currentGame.players.forEach((player) => {
    if (player.get("role") === "consumer") {
      const basket = player.round.get("basket") || {};
      let score = player.get("score") || 0;

      Object.entries(basket).forEach(([productId, quantity]) => {
        const producer = stage.currentGame.players.find(p => p.id === productId);
        if (producer) {
          const productQuality = producer.round.get("productQuality");
          const points = productQuality === "high" ? 10 : 5;
          score += points * quantity;
        }
      });

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

Empirica.onGameStart(({ game }) => {
  const round = game.addRound({ name: `Round` });
  round.addStage({ name: "selectRoleStage", duration: 24000 });
  round.addStage({ name: "claimsStage", duration: 24000 });
  round.addStage({ name: "choiceStage", duration: 24000 });
  round.addStage({ name: "feedbackStage", duration: 24000 });
  round.addStage({ name: "scoreboardStage", duration: 24000 });
  
  game.players.forEach(player => player.set("score", 0));
  assignRoles(game);
});

Empirica.onStageEnded(({ stage }) => {
  if (stage.get("name") === "choiceStage") {
    const unitsSoldMap = new Map();

    stage.currentGame.players.forEach((player) => {
      if (player.get("role") === "consumer") {
        const basket = player.round.get("basket") || {};
        Object.entries(basket).forEach(([producerId, quantity]) => {
          unitsSoldMap.set(producerId, (unitsSoldMap.get(producerId) || 0) + quantity);
        });
      }
    });

    stage.currentGame.players.forEach((player) => {
      if (player.get("role") === "producer") {
        const producerId = player.id;
        const unitsSold = unitsSoldMap.get(producerId) || 0;
        const productPrice = player.round.get("productPrice");
        const productCost = player.round.get("productCost");
        const profit = unitsSold * (productPrice - productCost);
        const capital = player.round.get("capital");
        player.set("score", capital + profit);
      }
    });

    updateConsumerScores(stage);
  }
});

Empirica.onGameEnded(({ game }) => {});
