import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();
 
// Empirica.gameInit(game =>{
//   game.players.forEach((player, i) =>{
//     player.set("score", 0);

//   });
// })

Empirica.onGameStart(({ game }) => {
  const round = game.addRound({
    name: `Round`,
   });
   round.addStage({ name: "selectRoleStage", duration: 24000 });
   round.addStage({ name: "claimsStage", duration: 24000 });
   round.addStage({ name: "deliberateStage", duration: 24000 });
   round.addStage({ name: "choiceStage", duration: 24000 });
   round.addStage({ name: "feedbackStage", duration: 24000 });
   round.addStage({ name: "scoreboardStage", duration: 24000})

   game.players.forEach((player, i) =>{
    player.set("score", 0);

  });
});

Empirica.onRoundStart(({ round }) => {});

Empirica.onStageStart(({ stage }) => {
  // calculateAdvertiserScore(stage);
});

Empirica.onStageEnded(({ stage }) => {
  if (stage.get("name") === "choiceStage") {
    console.log("choice stage just ended")
    // Initialize a map to track units sold for each producer
    const unitsSoldMap = new Map();

    // Iterate over all players
    for (const player of stage.currentGame.players) {
      // Check if the player is a consumer
      console.log("Player: ", player)
      if (player.get("role") === "consumer") {
        // Get the basket for the current consumer
        const basket = player.round.get("basket") || {};
        console.log("Basket of current consumer is: ", basket)

        // Update the units sold for each producer based on the consumer's basket
        for (const [productId, quantity] of Object.entries(basket)) {
          // Extract the producer's ID from the productId
          const producerId = productId; // If productId itself is the producerId, use it directly
          const currentUnitsSold = unitsSoldMap.get(producerId) || 0;
          unitsSoldMap.set(producerId, currentUnitsSold + quantity);
        }
      }
    }

    // Now, update each producer's unitsSold
    for (const [producerId, unitsSold] of unitsSoldMap.entries()) {
      // Find the producer by their ID
      const producer = stage.currentGame.players.find(p => p.id === producerId);
      console.log("Producer id is", producerId)
      // Check if we found the producer and that they have the role 'producer'
      if (producer && producer.get("role") === "producer") {
        // Get existing unitsSold, if any, and add the new units sold to it
        const existingUnitsSold = producer.round.get("unitsSold") || 0;
        producer.round.set("unitsSold", existingUnitsSold + unitsSold);
      }
    }

    console.log("Units sold for each producer updated successfully.");
  }
});




Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => {});

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function calculateAdvertiserScore(stage) {
  if (
    stage.get("name") !== "Advertise" ||
    stage.round.get("task") !== "advertise" ||
    stage.get("name") !== "Advertise Again" ||
    stage.round.get("task") !== "advertiseAgain"
  ) {
    return;
  }

  for (const player of stage.currentGame.players) {
    console.log('calculating advertiser score')
    let adQuality = player.get("adQuality")
    let salesCount = 0
    let randomDraw = 0
    if (adQuality == "extraordinary") {
      randomDraw = getRandomInt(100)
      salesCount = randomDraw * 15;
    } {
      let randomDraw = getRandomInt(100)
      salesCount = randomDraw * 10;
    }

    player.set("numBuyers", randomDraw);

    let totalScore = player.get("score") || 0;
    player.set("salesCount", salesCount);
    player.set("score", totalScore + salesCount);
    player.set("scoreUpdated", true)
  }
}
