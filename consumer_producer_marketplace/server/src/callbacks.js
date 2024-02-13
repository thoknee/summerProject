import { ClassicListenersCollector } from "@empirica/core/admin/classic";
// import { useRound } from "@empirica/core/player/classic/react";

export const Empirica = new ClassicListenersCollector();

async function updateProducerClaimScores(game) {
  await game.players.forEach(async (player) => {
    if (player.get("role") !== "producer") return;
    const claims = player.get("claims");
    const round = player.round.get("round")
    const currentClaims = claims.find((item) => item.round === round);
    // const originalScore = player.get("score") || 0;
    let capital = player.get("capital");
    const warrants = player.get("warrants")
    const currentWarrants = warrants.find((item) => item.round === round);
    const warrantAdded = currentWarrants.warrantAdded;
    let scoreDiff = player.get("scoreDiff")
    let score = player.get("score")
    let oldScore = player.get("score")
    const warrantPrice = currentWarrants.warrantPrice;
    console.log("warrantPrice in callbacks", warrantPrice);
    // let score = player.get("score") || 0;
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
    // const warrantAdded = player.round.get("warrantAdded");
    const warrantPrice = player.round.get("warrantPrice");
    const currentChallenges = challenges.find((item) => item.round === round);
    // let oldScore = player.get("score") || 0;
    let scoreDiff = player.get("scoreDiff")
    let score = player.get("score")
    let oldScore = player.get("score")
    let wallet = player.get("wallet");
    // let score = player.get("score") || 0;
    if (currentChallenges.status === true && currentChallenges.challenge === true) {
      wallet += warrantPrice;
      score += warrantPrice;
      player.set("score", score)
      player.set("scoreDiff", scoreDiff + score - oldScore)
      player.set("wallet", wallet);
      return
    }
    else if (currentChallenges.status === true && currentChallenges.challenge === false) {
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
    const currentStock = stock.find((item) => item.round === round);
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
  if (stage.get("name") === "feedbackStage") {
    updateProducerClaimScores(stage.currentGame);
    updateConsumerClaimScores(stage.currentGame);
  }
});

Empirica.onGameEnded(({ game }) => { });