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
    const unitsSold = player.round.get("unitsSold") || 0; // Replace with actual logic to get sales
    const profit = unitsSold * (productPrice - productCost); // Simplified profit calculation
    

    return (
      <div>
        <br/>
        <h3><b>Producer Summary</b></h3>
        <p>You produced a {productQuality} quality product and advertised it as a {adQuality} quality product.</p>
        <p>Consumer bought <b>{unitsSold}</b> of your product at a price of ${productPrice}</p>
        <p>This gives you a total profis of: ${profit.toFixed(2)}</p>
        <br/>
        <p>Your score is your profits + capital you had left.</p>
        <p> You had ${capital} of capital and ${profit} profit from sales for
        a total score of {capital + profit} in this round.</p>
      </div>
    );
  };

  // Consumer-specific feedback
  const renderConsumerFeedback = () => {
    const basket = player.round.get("basket") || {};
  
    return (
      <div>
        <h3>Your Consumer Summary</h3>
        <ul>
          {Object.entries(basket).map(([producerId, quantity], index) => {
            const producers = players.filter(p => p.get("role") === "producer");
            const producer = producers.find(p => p.id === producerId);
  
            // Check if the producer is found
            if (!producer) {
              return <li key={index}>Producer data not found for ID: {producerId}</li>;
            }
  
            return (
              <li key={index}>
                <p>Producer: {producerId} ({producer.round.get("producerName")})</p>
                <p>Units Bought: {quantity}</p>
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
    <div>
      <br/>
      {role === "producer" && renderProducerFeedback()}
      {role === "consumer" && renderConsumerFeedback()}
      <br/>
      <button style = {styles.proceedButton} onClick={handleProceed}>Proceed to next round</button>
    </div>
  );
}
    

const styles = {
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