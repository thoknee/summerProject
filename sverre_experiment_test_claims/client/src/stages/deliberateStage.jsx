import React, { useEffect } from "react";
import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";

export function DeliberateStage() {
  const player = usePlayer();
  const players = usePlayers();
  const role = player.get("role");

  useEffect(() => {
    // Automatically submit for producers
    if (role === "producer") {
      player.stage.set("submit", true);
    }
  }, [player, role]);

  const handleProceed = () => {
    // Submit the stage for the consumer
    player.stage.set("submit", true);
  };

  // Render function for consumer to view products
  const renderProductFeed = () => {
    // Filter out the current player and only include producers
    return players
      .filter(p => p.get("role") === "producer")
      .map((producer, index) => {
        const productQuality = producer.round.get("productQuality");
        const adStrategy = producer.round.get("adStrategy");
        // Replace with actual logic to get product name and price

        return (
          <div key={index} className="product-card" style={styles.productCard}>
            <h4>Seller: {producer.id}</h4>
            <h3>{`Product ${index + 1}`}</h3>
            <p>Advertised Quality: {productQuality}</p>
            <p>Advertisement Strategy: {adStrategy}</p>
            <p>Price: {/* Insert logic to display price */}</p>
            {/* Add image, ratings, etc. */}
          </div>
        );
      });
  };

  if (!role) {
    return <div>Loading...</div>;
  }

  if (role === "producer") {
    return (
      <div style={styles.waitingScreen}>
        <h2>Waiting Screen</h2>
        <p>Wait for consumers to view your advertisements.</p>
      </div>
    );
  }

  if (role === "consumer") {
    return (
      <div style={styles.consumerScreen}>
        <h2>Advertisements</h2>
        <div style={styles.productFeed}>{renderProductFeed()}</div>
        <button onClick={handleProceed} style={styles.proceedButton}>Proceed to Buying</button>
      </div>
    );
  }

  return <div>Unknown role</div>;
}

// Updated styling for the product feed, cards, and button
const styles = {
  waitingScreen: {
    textAlign: "center",
    padding: "20px",
  },
  consumerScreen: {
    textAlign: "center",
    padding: "20px",
  },
  productFeed: {
    display: "flex",
    flexWrap: "wrap",
    gap: "30px",
    justifyContent: "center",
    marginBottom: "30px", // Added space below the product feed
  },
  productCard: {
    border: "1px solid #ddd",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    padding: "20px",
    borderRadius: "8px",
    width: "300px",
    textAlign: "center",
    backgroundColor: "#fff",
    margin: "0 auto",
  },
  proceedButton: {
    backgroundColor: "#4CAF50", // A green color for the button
    color: "white",
    padding: "15px 32px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px",
    margin: "4px 2px",
    cursor: "pointer",
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
};
