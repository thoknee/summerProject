import React, { useState } from "react";
import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";

export function ChoiceStage() {
  const player = usePlayer();
  const players = usePlayers();
  const role = player.get("role");
  const [wallet, setWallet] = useState(player.get("wallet") || 0);

  const handleProceed = () => {
    // Submit the stage for the consumer
    player.stage.set("submit", true);
  };

  // Consumer-specific functions
  const handlePurchase = (cost, productId) => {
    if (wallet >= cost) {
      const newWalletValue = wallet - cost;
      setWallet(newWalletValue);
      player.set("wallet", newWalletValue);
      // Assuming "purchases" is an array of productIds that the player has bought
      let purchases = player.round.get("purchases") || [];
      purchases.push(productId);
      player.round.set("purchases", purchases);
    } else {
      alert("Not enough funds to complete this purchase.");
    }
  };

  // Render function for consumer to view products and make purchases
  const renderProductFeed = () => {
    // Filter out the current player and only include producers
    return players
      .filter(p => p.get("role") === "producer")
      .map((producer, index) => {
        const productQuality = producer.round.get("productQuality");
        const adStrategy = producer.round.get("adStrategy");
        const price = producer.round.get("price"); // Replace with actual logic to get price

        return (
          <div key={index} className="product-card" style={styles.productCard}>
            <h4>Seller: {producer.id}</h4>
            <h3>{`Product ${index + 1}`}</h3>
            <p>Advertised Quality: {productQuality}</p>
            <p>Advertisement Strategy: {adStrategy}</p>
            <p>Price: {price}</p>
            <button onClick={() => handlePurchase(price, `Product ${index + 1}`)}>Buy</button>
          </div>
        );
      });
  };

  useEffect(() => {
    // Automatically submit for producers at the start of the stage
    if (role === "producer") {
      player.stage.set("submit", true);
    }
  }, [player, role]);

  if (!role) {
    return <div>Loading...</div>;
  }

  if (role === "producer") {
    return (
      <div style={styles.waitingScreen}>
        <h2>Waiting Screen</h2>
        <p>Wait for consumers to make their choices.</p>
      </div>
    );
  }

  if (role === "consumer") {
    return (
      <div>
        <h2>Advertisements</h2>
        <div style={styles.walletDisplay}>
          <span role="img" aria-label="wallet">💰</span> Wallet: ${wallet.toFixed(2)}
        </div>
        <div style={styles.productFeed}>{renderProductFeed()}</div>
        <button onClick={handleProceed} style={styles.proceedButton}>Proceed to Leaderboard</button>
      </div>
    );
  }

  return <div>Unknown role</div>;
}

// Styling for the product feed, cards, wallet display, and proceed button
const styles = {
  // ... (include other styles from previous example)
  proceedButton: {
    // ... (style your button accordingly)
  },
  // ... (include other styles from previous example)
};
