import { ClassicListenersCollector } from "@empirica/core/admin/classic";
// import { useRound } from "@empirica/core/player/classic/react";

export const Empirica = new ClassicListenersCollector();

// Function to update the score of consumers
async function updateConsumerScores(game) {
  // const roundHook = useRound();
  // const round = roundHook.get("name");
  await game.players.forEach(async (player) => {
    if (player.get("role") !== "consumer") return;
    const basket = player.get("basket");
    const wallet = player.get("wallet");
    const round = player.round.get("round")
    console.log("wallet in callbacks", wallet);
    console.log("basket in callbacks", basket);
    // const currentBasket = basket.find((item) => {
    //   if (item.round === round) {
    //     return item;
    //   }
    // });
    const originalScore = player.get("score") || 0;
    let score = player.get("score") || 0;
    basket.forEach((item) => {
      if (item.round === round) {
        score += wallet + (item.value - item.productPrice) * item.quantity;
      }
    });
    console.log("score in callbacks", score);
    // Object.entries(basket).forEach(([productId, quantity]) => {
    //   const producer = game.players.find((p) => p.id === productId);
    //   if (producer) {
    //     const productQuality = producer.round.get("productQuality");
    //     const productPrice = producer.round.get("productPrice");
    //     // TODO: Remove hardcoded values
    //     const points = productQuality === "high" ? 12 : 5;
    //     score += quantity * (points - productPrice);
    //   }
    // });
    player.set("score", score);
    // This shows how the score changed (i.e., +10, -5), to see if this changes consumer behavior
    player.set("scoreDiff", score - originalScore);
  });
}

// Function to process consumer baskets and create a map of units sold
// function processConsumerBaskets(game) {
//   const round = round.get("name");
//   const unitsSoldMap = new Map();
//   game.players.forEach((player) => {
//     if (player.get("role") === "consumer") {
//       const basket = player.round.get("basket") || {};
//       Object.entries(basket).forEach(([producerId, quantity]) => {
//         unitsSoldMap.set(
//           producerId,
//           (unitsSoldMap.get(producerId) || 0) + quantity
//         );
//       });
//     }
//   });

//   return unitsSoldMap;
// }

// Function to update the score of producers
async function updateProducerScores(game) {
  await game.players.forEach(async (player) => {
    if (player.get("role") !== "producer") return;
    const stock = player.get("stock");
    const capital = player.get("capital");
    const round = player.round.get("round")
    const currentStock = stock.find((item) => {
      if (item.round === round) {
        return item;
      }
    });
    const soldStock = currentStock.soldStock;
    const productPrice = currentStock.productPrice;
    const productCost = currentStock.productCost;
    const profit = (productPrice - productCost) * soldStock;
    console.log("profit in callbacks", profit)
    const originalScore = player.get("score") || 0;
    let score = player.get("score") || 0;
    score += profit + capital;
    player.set("score", score);
    // This shows how the score changed (i.e., +10, -5), to see if this changes producer behavior
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
    //   player.set("round", 1)
  });
  assignRoles(game);
});

Empirica.onStageEnded(({ stage }) => {
  if (stage.get("name") === "choiceStage") {
    // const unitsSoldMap = processConsumerBaskets(stage.currentGame);
    updateProducerScores(stage.currentGame);
    updateConsumerScores(stage.currentGame);
  }
});

Empirica.onGameEnded(({ game }) => { });
