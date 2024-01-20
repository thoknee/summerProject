import { usePlayer } from "@empirica/core/player/classic/react";
import React, { useState } from "react";
import { Button } from "../components/Button";
import { useGame } from "@empirica/core/player/classic/react";
import { usePlayers } from "@empirica/core/player/classic/react";

export function SelectRolesStage() {
  const player = usePlayer();
  const [selectedRole, setSelectedRole] = useState("");
  
  //this is how we get factor variables
  const game = useGame();
  const treatment = game.get("treatment");
  const shareOfProducers = treatment.producerPercentage//factor

  function handleSubmit() {// initializing variables here. Might be done server side in the future  
    
    //Producer initialization
    // TODO: Change how producerName is set so that it isn't hard coded
    if (player.get("role") === "producer") {
        if (player.round.get("producerName") === undefined) {
            player.round.set("producerName", "Tony's toothpaste");//hardcoded name
          }
        if (player.round.get("capital") === undefined) {
          player.round.set("capital", 20);
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
      }
      //Consumer initialization
      else if (player.get("role") === "consumer") {
        if (player.round.get("wallet") === undefined) {
          player.round.set("wallet", 20);
        }
        if (player.round.get("basket") === undefined) {
          player.round.set("basket", {});
        }
      }
  
      player.stage.set("submit", true);
    
  }
  if (player.get("role") === "consumer"){
    return(
        <div className="md:min-w-96 lg:min-w-128 xl:min-w-192 flex flex-col items-center space-y-10 p-4">
      <p>You will play as a <b>{player.get("role")}</b>!</p> 
      <ConsumerInfo/>
      <Button handleClick={handleSubmit} primary>
        I'm ready!
      </Button>
    </div>
    )
  }

  if (player.get("role") === "producer"){
    return(
        <div className="md:min-w-96 lg:min-w-128 xl:min-w-192 flex flex-col items-center space-y-10 p-4">
      <p>You will play as a <b>{player.get("role")}</b>!</p> 
      <ProducerInfo/>
      <Button handleClick={handleSubmit} primary>
        I'm ready!
      </Button>
    </div>
    )
  }

  return (
    <div className="md:min-w-96 lg:min-w-128 xl:min-w-192 flex flex-col items-center space-y-10 p-4">
      <p>Role assignment failed. Contact research staff.</p>
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

  function ProducerInfo() {
    return (
      <div>
        <p>🌟 <strong>Welcome Producers!</strong> 🌟</p>
        
        <p>As a producer, your main goal is to maximize your profits! 💰 Each round presents a new opportunity for you to shine. You get to decide what kind of products you'll produce and the best way to advertise them. Remember, premium products usually fetch a higher price! 💎</p>
        <br/>
        <p>Here's the catch: every round, you'll use all your capital (that's your hard-earned money 💵) to create products of the quality you choose. But be strategic! The consumers only learn about the true quality of your product after they buy it. So, think carefully about your production and advertising choices. 🤔</p>
        <br/>
        <p>And don't forget, you're not alone in this game! Other producers are out there, trying to make their mark just like you. Keep an eye on the competition while you plot your path to success. 🏭👀</p>
        
        <p>Are you ready to take on the challenge and become the top producer? Let's get started! 🚀🏆</p>
      </div>
    );
  };
  

  function ConsumerInfo() {
    return (
        <div>
            <p>🛒 <strong>Welcome Consumers!</strong> 🛒</p>
            <br/>
            <p>As a savvy consumer, your mission is to make smart buying decisions! 🧐 Every round is a new adventure in the marketplace, where you'll encounter a variety of products. Your goal is to get the best value for your money. Remember, not all that glitters is gold! 🌟</p>
            <br/>
            <p>Here's the twist: you'll be spending from your wallet 💸, but beware! The true quality of products is only revealed after purchase. So, use your intuition and make your choices wisely. Are the producers bluffing with their ads? Or is it really a deal of a lifetime? 🕵️‍♀️🕵️‍♂️</p>
            <br/>
            <p>Remember, you're competing against other consumers to be the most astute shopper. Keep an eye on your wallet and don't get swayed by every shiny ad! 🛍️💡</p>
            <br/>
            <p>Ready to embark on this shopping spree and make some clever purchases? Let's dive into the world of consumer wisdom! 🚀🛍️</p>
        </div>
    );
};



 {/* <RoleOption role="consumer" selectedRole={selectedRole} onRoleChange={handleRoleChange} />
      <RoleOption role="producer" selectedRole={selectedRole} onRoleChange={handleRoleChange} /> */}

const styles = {
    waitingScreen: {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        maxWidth: '500px',
        margin: '20px auto',
    },
    emoji: {
        fontSize: '2rem',
        marginTop: '20px',
    }
}