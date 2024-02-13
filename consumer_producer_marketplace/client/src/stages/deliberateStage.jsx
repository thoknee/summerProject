
import React, { useState, useEffect } from "react";
import { Steps, usePlayer, usePlayers } from "@empirica/core/player/classic/react";

export function DeliberateStage() {
  const player = usePlayer();
  const players = usePlayers();
  const role = player.get("role");
  console.log("Inside deli val1")
  const handleProceed = () => {
    player.stage.set("submit", true);
  };

  const handleSubmit = () => {
    player.stage.set("submit", true);
  }
  // Producer-specific feedback
  const renderProducerFeedback = () => {
    const productQuality = player.round.get("productQuality");
    const adQuality = player.round.get("adQuality")
    const productPrice = player.round.get("productPrice")
    const productCost = player.round.get("productCost")
    const capital = player.get("capital")
    const unitsSold = player.round.get("unitsSold") || 0;
    const profit = unitsSold * (productPrice - productCost);
    const warrantAdded = player.round.get("warrantAdded")
    if (player.round.get("challengedClaim") == "Yes" && adQuality != productQuality) {
      player.round.set("warrantClaim", false);
      player.set("capital", capital + player.round.get("warrantPrice"))
      // player.round.set("earnedClaim", producer.round.get("warrantPrice"))
      player.set("score", player.get("score") - player.round.get("warrantPrice"))
    }
    if (player.round.get("challengeClaim") == "Yes" && actualQuality == adQuality) {
      player.round.set("warrantClaim", true);
      // player.round.set("earnedClaim", 0);

    }

    return (
      <div style={styles.feedbackContainer}>

        <h3><b>🌟 Your Warrant Summary 🌟</b></h3>
        <p><span role="img" aria-label="factory">🏭</span> You produced a <b>{productQuality}</b> quality product and advertised it as <b>{adQuality}</b> quality.</p>
        {!warrantAdded ? <>
          <p>There was no warrant to be challenged.</p>
          <br /><p><span role="img" aria-label="trophy">🏆</span> Your current score is <b>${player.get("score")}</b>.</p>
        </> : (player.round.get("warrantClaim") ? <>
          <p>Your warrant claim was challenged <span className="bg-green-700">unsucessfully!</span></p>
          <br /><p><span role="img" aria-label="trophy">🏆</span> Your current score is <b>${player.get("score")}</b>.</p>
        </> : <>
          <p>Your warrant claim was challenged <span className="bg-red-700">sucessfully!</span></p>
          <p>You lose your warrant Price of ${player.round.get("warrantPrice")}</p>
          <br /><p><span role="img" aria-label="trophy">🏆</span> Your current score is <b>${player.get("score")}</b>.</p>
        </>)}
        <br />
      </div>
    );
  };

  // Consumer-specific feedback
  const renderConsumerFeedback = () => {
    const challengeStatus = player.round.get("challengeStatus")
    const basket = player.round.get("basket") || {};
    const wallet = player.get("wallet")
    console.log("Hiiii")
    return (
      <div style={styles.feedbackContainer}>
        <h3><b>Your Warrant Summary</b></h3>
        {Object.getOwnPropertyNames(basket).length === 0 ? (
          <h3> No Products bought in this round, hence no warrants were challenged.</h3>
        ) : (
          <ul>
            {console.log(basket)}
            {Object.entries(basket).map(([producerId, quantity], index) => {
              const producers = players.filter(p => p.get("role") === "producer");
              const producer = producers.find(p => p.id === producerId);
              const warrantAdded = producer.round.get("warrantAdded");

              if (!producer) {
                return <li key={index}>Producer data not found for ID: {producerId}</li>;
              }

              const adQuality = producer.round.get("adQuality");
              const actualQuality = producer.round.get("productQuality");
              const emoji = getQualityMatchEmoji(adQuality, actualQuality);
              if (player.round.get("challengeStatus") == "Yes" && actualQuality != adQuality) {
                player.round.set("challengeSuccess", true);
                player.set("wallet", wallet + producer.round.get("warrantPrice"))
                player.round.set("earnedClaim", producer.round.get("warrantPrice"))
                player.set("score", player.get("score") + player.round.get("earnedClaim"))
                console.log("Hello")
              }
              else if (player.round.get("challengeStatus") == "Yes" && actualQuality == adQuality) {
                player.round.set("challengeSuccess", false);
                player.round.set("earnedClaim", 0);

              }
              else {
                player.round.set("earnedClaim", 0);
              }
              // const challengeStatus = challengeStatuses[producerId];
              // const capital = player.get("capital")

              return (
                <li key={index}>
                  <p><b>Producer:</b> {producerId} ({producer.round.get("producerName")})</p>
                  {/* <p><b>Units Bought:</b> {quantity}</p> */}
                  {!warrantAdded ? <>
                    <p>There was no warrant to be challenged.</p>
                    <br /><p><span role="img" aria-label="trophy">🏆</span> Your current score is <b>${player.get("score")}</b>.</p>
                  </> : <></>}
                  {challengeStatus === "Yes" ? (
                    actualQuality != adQuality ? (<>
                      <p>Your Challenge was <span className="bg-green-700">successful!</span></p>
                      <p>You have been rewarded ${producer.round.get("warrantPrice")}</p>
                      <br /><p><span role="img" aria-label="trophy">🏆</span> Your current wallet is your remaining capital (<b>${wallet - producer.round.get("warrantPrice")}</b>) + successful claim amount(<b>${producer.round.get("warrantPrice")}</b>) = (<b>${wallet}</b>).</p>
                      <br /><p>Your current score is {player.get("score")}</p>
                    </>) : (
                      <>
                        <p>Your Challenge was <span className="bg-red-700">unsuccessful!</span></p>
                        <p>You have lost the challenge amount of ${producer.round.get("warrantPrice")}</p>
                        <br /><p><span role="img" aria-label="trophy">🏆</span> Your current score is <b>${player.get("score")}</b>.</p>
                      </>)
                  ) : (<>
                    <p>You did not challenge the warrant!</p>
                    <br /><p><span role="img" aria-label="trophy">🏆</span> Your current score is <b>${player.get("score")}</b>.</p>
                  </>)}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  };



  if (!role) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.feedbackContainer}>
      <br />
      {role === "producer" && renderProducerFeedback()}
      {role === "consumer" && renderConsumerFeedback()}

      
      {/* {role === "producer" ? renderProducerFeedback() : renderConsumerFeedback()} */}
      <br />
      {role === "producer" ? <button style={styles.proceedButton} onClick={handleProceed}>Proceed to next round</button> : <button style={styles.proceedButton} onClick={handleSubmit}>Proceed to next round</button>}
    </div>
  );
}

const getQualityMatchEmoji = (advertisedQuality, actualQuality) => {
  if (advertisedQuality === actualQuality) {
    return '👍'; // Thumbs up for a match
  } else if (advertisedQuality === "high" && actualQuality === "low") {
    return '😠'; // Angry for high advertised but low actual quality
  } else if (advertisedQuality === "low" && actualQuality === "high") {
    return '🤔'; // Thinking for low advertised but high actual quality
  } else {
    return '❓'; // Question mark for any other case
  }
};

const styles = {
  feedbackContainer: {
    backgroundColor: '#f3f3f3', // Light grey background for the container
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    marginBottom: '20px'
  },
  proceedButton: {
    backgroundColor: '#4CAF50', // Green background as in submitButton
    color: 'white', // White text
    padding: '12px 24px', // Generous padding for better touch area
    fontSize: '16px', // Slightly larger font size
    borderRadius: '5px', // Rounded corners
    border: 'none', // Remove default border
    cursor: 'pointer', // Cursor changes to pointer to indicate it's clickable
    boxShadow: '0 4px #2e7d32', // Shadow effect for depth, darker than background
    transition: 'all 0.2s ease-in-out', // Smooth transition for hover effects

    ':hover': {
      backgroundColor: '#45a049', // Slightly lighter green when hovered
      boxShadow: '0 2px #2e7d32', // Adjust shadow for hover effect
    }
  },
  challengeButton: {
    backgroundColor: "#008CBA", // Blue background
    color: "white", // White text
    padding: "10px 20px", // Padding
    fontSize: "14px", // Font size
    borderRadius: "4px", // Rounded corners
    border: "none", // Remove default border
    cursor: "pointer", // Cursor to pointer
    boxShadow: "0 3px #005f73", // Shadow effect for depth
    transition: "all 0.2s ease", // Smooth transition for hover effects
    margin: "10px 10px", // Margin top and bottom

    ":hover": {
      backgroundColor: "#0077b6", // Slightly lighter blue when hovered
      boxShadow: "0 2px #005f73", // Adjust shadow for hover effect
    },

    ":disabled": {
      backgroundColor: "#cccccc", // Disabled state color
      cursor: "not-allowed", // Change cursor for disabled state
      boxShadow: "none",
    },
  },
};

// challenge => update score 
// consumer win => wallet + warrant amount
// producer win => capital + warrant amount