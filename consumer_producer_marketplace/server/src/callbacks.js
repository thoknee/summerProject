import { ClassicListenersCollector } from "@empirica/core/admin/classic";
import { getconsumerAgentFromId } from "../../client/src/strategie/ConsumerAgent.js"

export const Empirica = new ClassicListenersCollector();

const fs = require('fs');
const path = require('path');

const folderPath = '/';
const fileName = 'choices_consumer.json';
const filePath = path.join(folderPath, fileName);

// function appendObjectToJSON(newObject) {
//   // Check if the folder exists
//   fs.access(folderPath, fs.constants.F_OK, (err) => {
//     if (err) {
//       // Folder doesn't exist, create it
//       fs.mkdir(folderPath, { recursive: true }, (err) => {
//         if (err) {
//           console.error('Error creating folder:', err);
//         } else {
//           console.log('Folder created successfully!');
//           createFileAndAppend(newObject);
//         }
//       });
//     } else {
//       // Folder exists, proceed to create file and append
//       createFileAndAppend(newObject);
//     }
//   });
// }

// function createFileAndAppend(newObject) {
//   // Check if the file exists
//   fs.access(filePath, fs.constants.F_OK, (err) => {
//     if (err) {
//       // File doesn't exist, create it with initial structure
//       const initialData = { dataList: [] };
//       writeToFile(initialData, newObject);
//     } else {
//       // File exists, proceed to read and append
//       readFileAndAppend(newObject);
//     }
//   });
// }

// function readFileAndAppend(newObject) {
//   // Read the existing JSON file
//   fs.readFile(filePath, 'utf8', (err, data) => {
//     if (err) {
//       console.error('Error reading JSON file:', err);
//       return;
//     }

//     try {
//       // Parse JSON content
//       const jsonData = JSON.parse(data);

//       // Modify the object (assuming it's an array called 'dataList')
//       jsonData.dataList.push(newObject);

//       // Write back to the JSON file
//       writeToFile(jsonData, newObject);
//     } catch (parseError) {
//       console.error('Error parsing JSON:', parseError);
//     }
//   });
// }

// function writeToFile(data, newObject) {
//   // Convert data to JSON
//   const updatedJson = JSON.stringify(data, null, 2);

//   // Write back to the JSON file
//   fs.writeFile(filePath, updatedJson, 'utf8', (err) => {
//     if (err) {
//       console.error('Error writing to JSON file:', err);
//     } else {
//       console.log('Object appended successfully!');
//     }
//   });
// }

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
    const round = player.round.get("round")
    const agents = game.get("agents");
    const consumerAgent = agents.find(p => {
      return p.role === "consumer" && p.agent === "artificial"
    })
    const others = agents.filter(p => {
      return p.role !== "consumer" || p.agent !== "artificial"
    })
    const strategy = getconsumerAgentFromId(consumerAgent.strategy);
    const roundNum = parseInt(round.replace("Round", ""), 10);
    if (consumerAgent.purchaseHistory.length < roundNum) {
      consumerAgent.purchaseHistory.push({
        "purchasedQuantity": strategy.purchaseQuantity(),
      })
    }

    others.push(consumerAgent);
    console.log(others);
    game.set("players", others);

    const capital = player.get("capital");
    const tempStock = player.get("stock");
    const oldStock = player.get("stock");
    const currentStock = oldStock.find((item) => item.round === round);
    const quantity = currentStock.remainingStock;
    const wallet = player.get("wallet");
    const productPrice = currentStock.productPrice;
    const productCost = currentStock.productCost;
    const productQuality = currentStock.productQuality
    const productAdQuality = currentStock.productAdQuality
    const mockQuantity = parseInt(wallet / productPrice);
    const soldStock = mockQuantity <= quantity ? mockQuantity : quantity
    const initialStock = currentStock.initialStock;
    if (soldStock == 0) {

      const totalCost = initialStock * productCost;
      const totalSales = soldStock * productPrice;
      const originalScore = player.get("score") || 0;
      let score = player.get("score") || 0;
      score += (totalSales - totalCost);
      player.set("score", score);
      player.set("scoreDiff", score - originalScore);
      player.set("capital", capital + totalSales);

      return;
    }
    else {
      // Artificial player
      const trialStock = tempStock.map((item) => {
        return item.round === round
          ? {
            ...item,
            remainingStock: item.remainingStock - soldStock,
            soldStock: item.soldStock + soldStock,
          }
          : item;
      });

      player.set("stock", trialStock);
      const totalCost = initialStock * productCost;
      const totalSales = soldStock * productPrice;
      const originalScore = player.get("score") || 0;
      let score = player.get("score") || 0;
      score += (totalSales - totalCost);
      player.set("score", score);
      player.set("scoreDiff", score - originalScore);
      player.set("capital", capital + totalSales);
      player.set("wallet", wallet - parseInt(productPrice * soldStock))

      // const newObject = {
      //   round: round,
      //   purchaseQuantity: soldStock,
      //   producedStock: initialStock,
      //   productQuality: productQuality,
      //   productAdQuality: productAdQuality,
      //   productPrice: productPrice,
      //   remainingWallet: wallet,
      //   strategyUpdate: "",
      //   opponentStrategy: ""
      // };
      // appendObjectToJSON(newObject);
      return;
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
    // const role = index < numberOfProducers ? "producer" : "consumer";
    const role = "producer"
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

// Empirica.onStageStart(({ stage }) => {
//   switch(stage.get("name")) {

//   }
// })

Empirica.onStageEnded(({ stage }) => {
  switch (stage.get("name")) {
    // case "choiceStage":
    //   updateProducerScores(stage.currentGame);
    //   updateConsumerScores(stage.currentGame);
    //   break;
    case "stockStage":
      updateProducerScores(stage.currentGame);
      break;
  }
});

Empirica.onGameEnded(({ game }) => { });
