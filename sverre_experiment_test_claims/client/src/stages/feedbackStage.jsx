import React from "react";
import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";

export function FeedbackStage() {
  const player = usePlayer();
  const players = usePlayers();
  const role = player.get("role");

  const handleProceed = () => {
    player.stage.set("submit", true);
  };

  // Producer-specific feedback
  const renderProducerFeedback = () => {
    const productQuality = player.round.get("productQuality");
    const adQuality = player.round.get("adQuality")
    const productPrice = player.round.get("productPrice")
    const productCost = player.round.get("productCost")
    const capital = player.round.get("capital")
    const unitsSold = player.round.get("unitsSold") || 0;
    const profit = unitsSold * (productPrice - productCost);

    return (
      <div style={styles.feedbackContainer}>
        <h3><b>🌟 Producer Summary 🌟</b></h3>
        <p><span role="img" aria-label="factory">🏭</span> You produced a <b>{productQuality}</b> quality product and advertised it as <b>{adQuality}</b> quality.</p>
        <p><span role="img" aria-label="shopping-cart">🛒</span> Consumers bought <b>{unitsSold}</b> units of your product at <b>${productPrice}</b> each.</p>
        <p><span role="img" aria-label="money-bag">💰</span> This resulted in a total profit of: <b>${profit.toFixed(2)}</b>.</p>
        <br/>
        <p><span role="img" aria-label="trophy">🏆</span> Your score this round is your profits (<b>${profit}</b>) plus any remaining capital (<b>${capital}</b>), for a total of <b>${capital + profit}</b>.</p>
      </div>
    );
};

  // Consumer-specific feedback
  const renderConsumerFeedback = () => {
    const basket = player.round.get("basket") || {};
  
    return (
      <div style={styles.feedbackContainer}>
        <h3><b>🛒 Your Consumer Summary</b></h3>
        <ul>
          {Object.entries(basket).map(([producerId, quantity], index) => {
            const producers = players.filter(p => p.get("role") === "producer");
            const producer = producers.find(p => p.id === producerId);
  
            if (!producer) {
              return <li key={index}>Producer data not found for ID: {producerId}</li>;
            }
            
            const adQuality = producer.round.get("adQuality");
            const actualQuality = producer.round.get("productQuality");
            const emoji = getQualityMatchEmoji(adQuality, actualQuality);

            return (
              <li key={index}>
                <p><b>Producer:</b> {producerId} ({producer.round.get("producerName")})</p>
                <p><b>Units Bought:</b> {quantity}</p>
                <p><b>Advertised quality was:</b> {adQuality} </p>
                <p><b>Real product quality was:</b> {producer.round.get("productQuality")} {emoji}</p>
              </li>
            );
          })}
        </ul>
      </div>
    );
};
  
  

  if (!role) {
    return <div>Loading...</div>;
  }



  return (
    <div style={styles.feedbackContainer}>
      <br/>
      {role === "producer" && renderProducerFeedback()}
      {role === "consumer" && renderConsumerFeedback()}
      <br/>
      <button style = {styles.proceedButton} onClick={handleProceed}>Proceed to next round</button>
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
}
};