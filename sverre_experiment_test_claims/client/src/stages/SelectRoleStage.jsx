import { usePlayer } from "@empirica/core/player/classic/react";
import React, { useState } from "react";
import { Button } from "../components/Button";
import { useGame } from "@empirica/core/player/classic/react";
import { usePlayers } from "@empirica/core/player/classic/react";
//import { a } from "@unocss/preset-mini/dist/utilities-a87209ad.js";

export function SelectRolesStage() {
  const player = usePlayer();
  const [selectedRole, setSelectedRole] = useState("");
  
  //this is how we get factor variables
  const game = useGame();
  const treatment = game.get("treatment");
  const shareOfProducers = treatment.producerPercentage//factor

  function handleRoleChange(event) {
    setSelectedRole(event.target.value);
    player.set("role", event.target.value);

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
      {/* <p>Choose to play as consumer or producer</p> */}
      <p>You will play as a {player.get("role")}.</p>    
      {/* <RoleOption role="consumer" selectedRole={selectedRole} onRoleChange={handleRoleChange} />
      <RoleOption role="producer" selectedRole={selectedRole} onRoleChange={handleRoleChange} /> */}
      <Button handleClick={handleSubmit} primary>
        I'm ready!
      </Button>
    </div>
  );
}


function RoleOption({ role, selectedRole, onRoleChange }) {
    return (
      <div>
        <label>
          <input
            type="radio"
            name="role"
            value={role}
            checked={selectedRole === role}
            onChange={onRoleChange}
          />
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </label>
      </div>
    );
  }