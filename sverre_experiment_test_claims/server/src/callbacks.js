import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();
 


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
});

Empirica.onRoundStart(({ round }) => {});

Empirica.onStageStart(({ stage }) => {
  // calculateAdvertiserScore(stage);
});

Empirica.onStageEnded(({ stage }) => {
  console.log("Stage object at onStageEnded:", stage); // To check the entire stage object
  console.log(stage.currentGame.players)
 
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
