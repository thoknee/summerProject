
import React, { useState, useEffect } from "react";
import { Steps, usePlayer, usePlayers, useRound } from "@empirica/core/player/classic/react";

export function DeliberateStage() {
  const player = usePlayer();
  const players = usePlayers();
  const role = player.get("role");
  const roundHook = useRound();
  const round = roundHook.get("name");
  // console.log("Inside deli val1")
  const handleProceed = () => {
    player.stage.set("submit", true);
  };

  const handleSubmit = () => {
    player.stage.set("submit", true);
  }
  // Producer-specific feedback
  const renderProducerFeedback = () => {
    const stock = player.get("stock");
    const tempStock = stock.find((item) => item.round === round);
    const productQuality = tempStock.productQuality;
    const productAdQuality = tempStock.productAdQuality;
    // const productPrice = tempStock.productPrice;
    // const productCost = tempStock.productCost;
    const capital = player.get("capital")
    // const unitsSold = tempStock.soldStock;
    // const profit = unitsSold * (productPrice - productCost);
    // const warrantAdded = player.round.get("warrantAdded")
    const warrants = player.get("warrants")
    const tempWarrant = warrants.find((item) => item.round === round);
    const warrantAdded = tempWarrant.warrantAdded;
    const warrantPrice = tempWarrant.warrantPrice;
    console.log("warrantPrice", warrantPrice)
    const claims = player.get("claims")
    const tempClaim = claims.find((item) => item.round === round);
    const warrantClaim = tempClaim.claim;
    const claimStatus = tempClaim.status;
    // const consumerID = tempClaim.consumerID;

    return (
      <div style={styles.feedbackContainer}>

        <h3><b>🌟 Your Warrant Summary 🌟</b></h3>
        <p><span role="img" aria-label="factory">🏭</span> You produced a <b>{productQuality}</b> quality product and advertised it as <b>{productAdQuality}</b> quality.</p>
        {!warrantAdded ? (<>
          <p>There was no warrant to be challenged.</p>
          <br /><p><span role="img" aria-label="trophy">🏆</span> Your current score is <b>{player.get("score")}</b>.</p>
        </>) : warrantAdded == true && claimStatus == true && warrantClaim == true ? (<>
          <p>Your warrant claim was challenged <span className="bg-green-700 text-white p-1 rounded-md">unsucessfully!</span></p>
          <p>You have been rewarded back your warrant amount, i.e. ${warrantPrice} back</p>
          <p>Your capital is ${capital}</p>
          <br /><p><span role="img" aria-label="trophy">🏆</span> Your current score is <b>{player.get("score")}</b>.</p>
        </>) : warrantAdded == true && claimStatus == true && warrantClaim == false ? (<>
          <p>Your warrant claim was challenged <span className="bg-red-700 text-white p-1 rounded-md">sucessfully!</span></p>
          <p>You lose your warrant Price of ${warrantPrice}</p>
          <p>Your capital is ${capital}</p>
          <br /><p><span role="img" aria-label="trophy">🏆</span> Your current score is <b>{player.get("score")}</b>.</p>
        </>) : warrantAdded == true && claimStatus == false ? (<>
          <p>Your warrant was not challenged this round.</p>
          <p>You have been rewarded back your warrant amount, i.e. ${warrantPrice} back</p>
          <p>Your capital is ${capital}</p>
          <br /><p><span role="img" aria-label="trophy">🏆</span> Your current score is <b>{player.get("score")}</b>.</p>
        </>) : (<>
          <p>Your capital is ${capital}</p>
          <br /><p><span role="img" aria-label="trophy">🏆</span> Your current score is <b>{player.get("score")}</b>.</p>
        </>)}
        <br />
      </div>
    );
  };

  // Consumer-specific feedback
  const renderConsumerFeedback = () => {
    const challenges = player.get("challenges")
    const tempChallenge = challenges.find((item) => item.round === round);
    const challengeStatus = tempChallenge.status;
    const warrantPrice = player.round.get("warrantPrice");
    const wallet = player.get("wallet")
    const challengeSuccess = tempChallenge.challenge
    const basket = player.get("basket")
    const tempBasket = basket.find((item) => item.round === round);
    const quantity = tempBasket.quantity;
    const warrantAdded = player.round.get("warrantAdded")
    const challengeAmount = player.round.get("challengeAmount")

    // console.log("Hiiii")
    return (
      <div style={styles.feedbackContainer}>
        <h3><b>Your Warrant Summary</b></h3>
        {quantity == 0 ? (<><p><h3> No Products bought in this round, hence no warrants were challenged.</h3></p></>) : warrantAdded == true && challengeStatus == true && challengeSuccess == true ? (<>
          <p>Your Challenge was <span className="bg-green-700 text-white p-1 rounded-md">successful!</span></p>
          <p>You have been rewarded ${warrantPrice}</p>
          <br /><p><span role="img" aria-label="trophy">🏆</span> Your successful claim amount of (<b>${warrantPrice}</b>) is added to your wallet = (<b>${wallet}</b>).</p>
          <br /><p>Your current score is {player.get("score")}</p>
        </>) : warrantAdded == true && challengeStatus == true && challengeSuccess == false ? (<>
          <p>Your Challenge was <span className="bg-red-700 text-white p-1 rounded-md">unsuccessful!</span></p>
          <p>You have lost the challenge amount of ${challengeAmount}</p>
          <p>Your current wallet is ${wallet}.</p>
          <br /><p><span role="img" aria-label="trophy">🏆</span> Your current score is <b>${player.get("score")}</b>.</p>
        </>) : warrantAdded == true && challengeStatus == false ? (<>
          <p>You did not challenge the warrant!</p>
          <br /><p><span role="img" aria-label="trophy">🏆</span> Your current score is <b>${player.get("score")}</b>.</p>
        </>) : (<>
          <p>The product was not warranted!</p>
          <p>Your capital is ${wallet}</p>
          <br /><p><span role="img" aria-label="trophy">🏆</span> Your current score is <b>${player.get("score")}</b>.</p>
        </>)}
        {/* {Object.getOwnPropertyNames(basket).length === 0 ? (
                    <h3> No Products bought in this round, hence no warrants were challenged.</h3>
                ) : (
                    <ul>
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
                            return (
                                <li key={index}>
                                    <p><b>Producer:</b> {producerId} ({producer.round.get("producerName")})</p>
                                    <p><b>Units Bought:</b> {quantity}</p>
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
                )} */}
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

// const getQualityMatchEmoji = (advertisedQuality, actualQuality) => {
//     if (advertisedQuality === actualQuality) {
//         return '👍'; // Thumbs up for a match
//     } else if (advertisedQuality === "high" && actualQuality === "low") {
//         return '😠'; // Angry for high advertised but low actual quality
//     } else if (advertisedQuality === "low" && actualQuality === "high") {
//         return '🤔'; // Thinking for low advertised but high actual quality
//     } else {
//         return '❓'; // Question mark for any other case
//     }
// };

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