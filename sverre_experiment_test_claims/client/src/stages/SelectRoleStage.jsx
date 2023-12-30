import { usePlayer } from "@empirica/core/player/classic/react";
import React, { useState } from "react";
import { Button } from "../components/Button";
import { useGame } from "@empirica/core/player/classic/react";

export function SelectRolesStage() {
  const player = usePlayer();
  const [selectedRole, setSelectedRole] = useState("");
  const game = useGame();
  console.log(game.playerCount)


  const shareOfProducers = (game.producerPercentage ? game.producerPercentage : 0.5)

  console.log(shareOfProducers)
  let numberOfProducers = Math.round(shareOfProducers * game.playerCount)
  if (numberOfProducers === 0){
    numberOfProducers = 1;
  }
  let numberOfConsumers = game.playerCount - numberOfProducers
 


  function handleRoleChange(event) {
    setSelectedRole(event.target.value);
  }

  

  function handleSubmit() {// initializing variables here. Might be done server side in the future
    if (selectedRole) {
      player.set("role", selectedRole);
      
      if (selectedRole === "producer") {
        if (player.round.get("producerName") === undefined) {//hardcoded name
            player.round.set("producerName", "Tony's toothpaste");
          }
        if (player.round.get("capital") === undefined) {
          player.round.set("capital", 100);
        }
        if (player.round.get("unitsSold") === undefined) {
          player.round.set("unitsSold", 0);
        }
        if (player.round.get("adQuality") === undefined) {
          player.round.set("adQuality", "");
        }
        if (player.round.get("productQuality") === undefined) {
          player.round.set("productQuality", "");
        }
      } else if (selectedRole === "consumer") {
        if (player.round.get("wallet") === undefined) {
            console.log("Setting starting value for wallet")
          player.round.set("wallet", 100);
        }
        if (player.round.get("basket") === undefined) {
          player.round.set("basket", {});
        }
      }
  
      player.stage.set("submit", true);
    } else {
      alert("Please select a role before proceeding.");
    }
  }
  

  return (
    <div className="md:min-w-96 lg:min-w-128 xl:min-w-192 flex flex-col items-center space-y-10">
      <p>Choose to play as consumer or producer</p>
      {/* <p>In this game there will be {numberOfProducers} producers and {numberOfConsumers} consumers.</p> */}

      <div>
        <label>
          <input
            type="radio"
            name="role"
            value="consumer"
            checked={selectedRole === "consumer"}
            onChange={handleRoleChange}
          />
          Consumer
        </label>
      </div>

      <div>
        <label>
          <input
            type="radio"
            name="role"
            value="producer"
            checked={selectedRole === "producer"}
            onChange={handleRoleChange}
          />
          Producer
        </label>
      </div>
      <Button handleClick={handleSubmit} primary>
        I'm done!
      </Button>
    </div>
  );
}
