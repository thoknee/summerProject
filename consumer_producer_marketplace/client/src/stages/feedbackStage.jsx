import React, { useState, useEffect } from "react";
import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";

export function FeedbackStage() {
  const player = usePlayer();
  const players = usePlayers();
  const role = player.get("role");
  const [challengeStatus, setChallengeStatus] = useState("No");
  
  // useEffect(() => {
  //   const initialStatuses = players.filter(p => p.get("role") === "producer")
  //     .reduce((acc, producer) => {
  //       acc[producer.id] = producer.round.get("challengeStatus") || "No";
  //       return acc;
  //     }, {});
  //   setChallengeStatuses(initialStatuses);
  // }, [players]);

  const handleProceed = () => {
    player.stage.set("submit", true);
  };

  const handleSubmit = () => {
    player.round.set("challengeStatus", challengeStatus)
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


    eturn (
      <div className="bg-gray-300 p-4 rounded-lg shadow-md mb-8">

        <h3><b>🌟 Producer Summary 🌟</b></h3>
        <p><span role="img" aria-label="factory">🏭</span> You produced a <b>{productQuality}</b> quality product and advertised it as <b>{adQuality}</b> quality.</p>
        <p><span role="img" aria-label="shopping-cart">🛒</span> Consumers bought <b>{unitsSold}</b> units of your product at <b>${productPrice}</b> each.</p>
        <p><span role="img" aria-label="money-bag">💰</span> This resulted in a total profit of: <b>${profit.toFixed(2)}</b>.</p>

        <br />
        <p><span role="img" aria-label="trophy">🏆</span> Your score this round is your profits (<b>${profit}</b>).</p>
        <br />
        <p>Your remaining capital for this round is : ${capital}</p>
      </div>
    );
  };

  // Consumer-specific feedback
  const renderConsumerFeedback = () => {
    const basket = player.round.get("basket") || {};
    const [wallet, setWallet] = useState(player.get("wallet"))
    const handleChallenge = (producer) => {
      if (producer.round.get("challengedClaim") == undefined || producer.round.get("challengedClaim") == "No") {
        producer.round.set("challengedClaim", "Yes")
        setChallengeStatus("Yes")
        setWallet(wallet - parseInt(producer.round.get("warrantPrice") / 10))
        player.set("wallet", wallet);
      }
      else {
        producer.round.set("challengedClaim", "No")
        setChallengeStatus("No")
        setWallet(wallet + parseInt(producer.round.get("warrantPrice") / 10))
        player.set("wallet", wallet);
      }

    };
    return (
      <div className="bg-gray-300 p-4 rounded-lg shadow-md mb-8">
        <h3><b>🛒 Your Consumer Summary</b></h3>
        {Object.getOwnPropertyNames(basket).length === 0 ? (
          <h3> No Products bought in this round </h3>
        ) : (
          <ul>

            {Object.entries(basket).map(([producerId, quantity], index) => {
              const producers = players.filter(p => p.get("role") === "producer");
              const producer = producers.find(p => p.id === producerId);
              const productQuality = producer.round.get("productQuality");
              const productPrice = producer.round.get("productPrice")
              const warrantAdded = producer.round.get("warrantAdded");

              if (!producer) {
                return <li key={index}>Producer data not found for ID: {producerId}</li>;
              }

              const adQuality = producer.round.get("adQuality");
              const actualQuality = producer.round.get("productQuality");
              const emoji = getQualityMatchEmoji(adQuality, actualQuality);
              // const challengeStatus = challengeStatuses[producerId];
              // const wallet = player.get("wallet")


              let value_hi = 15;
              let value_lo = 8;
              let value_use;

              if (actualQuality == "high") {
                value_use = value_hi;
              } else {
                value_use = value_lo;
              }

              return (
                <li key={index}>
                  <p><b>Producer:</b> {producerId} ({producer.round.get("producerName")})</p>
                  <p><b>Units Bought:</b> {quantity}</p>
                  <p><b>Advertised quality was:</b> {adQuality} </p>
                  <p><b>Real product quality was:</b> {producer.round.get("productQuality")} {emoji}</p>
                  <p><b>Remaining capital in wallet:</b> {wallet} </p>
                  <br />
                  {warrantAdded ? (
                    <>
                      <p><b>Are you willing to challenge the producer's warrant?</b></p>
                      <p><b>Warrant: {producer.round.get("warrantDesc")}</b></p>
                      <p><b>Challenge Amount: {parseInt(producer.round.get("warrantPrice") / 10)}</b></p>
                      <p><b>Your choice:</b> {challengeStatus}</p>
                      <button
                        className="bg-blue-600 text-white py-2 px-4 text-sm rounded-md border-none cursor-pointer shadow-md transition-all duration-200 ease-in-out hover:bg-blue-700 hover:shadow-md m-2.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                        onClick={() => {
                          if (wallet >= parseInt(producer.round.get("warrantPrice") / 10)) {
                            handleChallenge(producer)
                          }

                          else {
                            alert("Not enough money in your wallet to challenge")
                          }
                        }}
                        disabled={!warrantAdded}
                      >
                        Challenge
                      </button>
                    </>
                  ) : (
                    <p>Since this product is not warranted, you are not able to challenge it.</p>
                  )}<br />
                  <br /><p><span role="img" aria-label="trophy">🏆</span> Your current score is your remaining capital (<b>${wallet}</b>) + utility score(<b>${(value_use - productPrice) * quantity}</b>) = (<b>${wallet + (value_use - productPrice) * quantity}</b>).</p>
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
    <div className="bg-gray-300 p-4 rounded-lg shadow-md mb-8">
      <br />
      {role === "producer" && renderProducerFeedback()}
      {role === "consumer" && renderConsumerFeedback()}
      <br />
      <button className="bg-green-500 text-white py-3 px-6 text-lg rounded-md border-none cursor-pointer shadow-md transition-all duration-200 ease-in-out hover:bg-green-700 hover:shadow-md" onClick={role === "producer" ? handleProceed : handleSubmit}>Proceed to next round</button>

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