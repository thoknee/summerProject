import { usePlayer } from "@empirica/core/player/classic/react";
import React, { useState } from "react";
import { Button } from "../components/Button";

export function SelectRolesStage() {
  const player = usePlayer();
  const [selectedRole, setSelectedRole] = useState("");

  function handleRoleChange(event) {
    setSelectedRole(event.target.value);
  }

  function handleSubmit() {
    if (selectedRole) {
      player.set("role", selectedRole);
      player.stage.set("submit", true);
    } else {
      alert("Please select a role before proceeding.");
    }
  }

  return (
    <div className="md:min-w-96 lg:min-w-128 xl:min-w-192 flex flex-col items-center space-y-10">
      <p>Choose to play as consumer or producer</p>

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
