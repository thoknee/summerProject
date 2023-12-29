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
    const adStrategy = player.round.get("adStrategy");
    const sales = player.round.get("sales") || 0; // Replace with actual logic to get sales
    const profit = sales * (productQuality === "high" ? 2 : 1); // Simplified profit calculation

    return (
      <div>
        <h3>Your Producer Summary</h3>
        <p>Product Quality Chosen: {productQuality}</p>
        <p>Advertisement Strategy Chosen: {adStrategy}</p>
        <p>Units Sold: {sales}</p>
        <p>Profit: ${profit.toFixed(2)}</p>
      </div>
    );
  };

  // Consumer-specific feedback
  const renderConsumerFeedback = () => {
    const purchases = player.round.get("purchases") || [];
    
    return (
      <div>
        <h3>Your Consumer Summary</h3>
        <ul>
          {purchases.map((purchase, index) => {
            const producer = players.find(p => p.id === purchase.sellerId);
            const productMatch = purchase.adQuality === producer.round.get("productQuality");
            return (
              <li key={index}>
                <p>Product Bought: {purchase.productId}</p>
                <p>Advertised Quality: {purchase.adQuality}</p>
                <p>Actual Quality: {producer.round.get("productQuality")}</p>
                <p>Quality Match: {productMatch ? "Yes" : "No"}</p>
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
      {role === "producer" && renderProducerFeedback()}
      {role === "consumer" && renderConsumerFeedback()}
      <button onClick={handleProceed}>Proceed to Leaderboard</button>
    </div>
  );
}
    