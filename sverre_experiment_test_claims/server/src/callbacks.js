import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();
import { usePlayers } from "@empirica/core";
import { useGame } from "@empirica/core";

//On game stars runs after when desired number of players have joined the lobby
Empirica.onGameStart(({ game }) => {
  //Set up the initial rounds and stages
  const round = game.addRound({
    name: `Round`,
   });
   round.addStage({ name: "selectRoleStage", duration: 24000 });
   round.addStage({ name: "claimsStage", duration: 24000 });
   round.addStage({ name: "deliberateStage", duration: 24000 });
   round.addStage({ name: "choiceStage", duration: 24000 });
   round.addStage({ name: "feedbackStage", duration: 24000 });
   round.addStage({ name: "scoreboardStage", duration: 24000})
   
   //Sets each players starting score to 0
   game.players.forEach((player, i) =>{
    player.set("score", 0);
  });
  //Randomly assign roles. Uses the factor "producerPercentage" to determine proportion of consumers.
  assignRoles(game)

});

Empirica.onRoundStart(({ round }) => {});

Empirica.onStageStart(({ stage }) => {
  if (stage.get("name") === "selectRoleStage"){
    // numOfCurrentPlayers = usePlayers().length
    // console.log(numOfCurrentPlayers)
    console.log("assigning...")

  }
});

Empirica.onStageEnded(({ stage }) => {
  if (stage.get("name") === "choiceStage") {
    console.log("Choice stage just ended")
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
        
        //updating the score
        const productPrice = player.round.get("productPrice")
        const productCost = player.round.get("productCost")
        const capital = player.round.get("capital")
        const unitsSold = player.round.get("unitsSold") || 0; 
        const profit = unitsSold * (productPrice - productCost); // Simplified profit calculation
        producer.set("score", capital + profit)
      }
    }

    console.log("Units sold for each producer updated successfully.");
  }
  

});


Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => {});

function updateSalesCount(){
  console.log("updateSalesCountFunction")
}

function assignRoles(game) {
  const treatment = game.get("treatment");
  const producerPercentage = treatment.producerPercentage;
  const players = game.players;
  const playersInGame = players.length;
  let numberOfProducers = Math.round(producerPercentage * playersInGame);
  if (numberOfProducers === 0) {
    numberOfProducers = 1;
  }

  // Shuffle the array of players to randomize the order
  const shuffledPlayers = [...players].sort(() => 0.5 - Math.random());

  // Assign roles
  shuffledPlayers.forEach((player, index) => {
    const role = index < numberOfProducers ? "producer" : "consumer";
    player.set("role", role);
    console.log("Plauyer: ", player)
    console.log("Has role: ", role)
  });
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

