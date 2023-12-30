import React, { useState, useEffect } from "react";
import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";

function ConsumerProductCard({ producer, index, handlePurchase, wallet }) {
  const productQuality = producer.round.get("productQuality");
  const adStrategy = producer.round.get("adStrategy");
  const price = producer.round.get("price"); // Replace with actual logic to get price
  const productImage = productQuality === "high" 
    ? "graphics/PremiumToothpasteAI.png" // High-quality image path
    : "graphics/StandardToothpasteAI.png"; // Low-quality image path

  return (
    <div className="product-card" style={styles.productCard}>
      <h4>Seller: {producer.id}</h4>
      <h3>{`Product ${index + 1}`}</h3>
      <img src={productImage} alt={`Product ${index + 1}`} style={styles.productImage} />
      <p>Advertised Quality: {productQuality}</p>
      <p>Advertisement Strategy: {adStrategy}</p>
      <p>Price: {price}</p>
      <button onClick={() => handlePurchase(price, `Product ${index + 1}`)} disabled={wallet < price}>Buy</button>
    </div>
  );
}

function WalletDisplay({ wallet }) {
    return (
      <div style={styles.walletBox}>
        <span role="img" aria-label="wallet">💰</span>
        Wallet: ${wallet.toFixed(2)}
      </div>
    );
  }

export function ChoiceStage() {
  const player = usePlayer();
  const players = usePlayers();
  const role = player.get("role");
  const [wallet, setWallet] = useState(player.get("wallet") || 0);

  const handleProceed = () => {
    player.stage.set("submit", true);
  };

  const handlePurchase = (cost, productId) => {
    if (wallet >= cost) {
      const newWalletValue = wallet - cost;
      setWallet(newWalletValue);
      player.set("wallet", newWalletValue);
      let purchases = player.round.get("purchases") || [];
      purchases.push(productId);
      player.round.set("purchases", purchases);
    } else {
      alert("Not enough funds to complete this purchase.");
    }
  };

  const renderProductFeed = () => {
    return players
      .filter(p => p.get("role") === "producer")
      .map((producer, index) => (
        <ConsumerProductCard 
          key={index} 
          producer={producer} 
          index={index} 
          handlePurchase={handlePurchase}
          wallet={wallet} 
        />
      ));
  };

  useEffect(() => {
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
        <WalletDisplay wallet={wallet} />
        <div style={styles.productFeed}>{renderProductFeed()}</div>
        <button onClick={handleProceed} style={styles.proceedButton}>Proceed to Leaderboard</button>
      </div>
    );
  }

  return <div>Unknown role</div>;
}

const styles = {
  waitingScreen: {
    // Styles for the waiting screen
  },
  walletDisplay: {
    // Styles for wallet display
  },
  productFeed: {
    // Styles for the product feed
  },
  productCard: {
    // Styles for the product card
    border: "1px solid #ddd",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    padding: "20px",
    borderRadius: "8px",
    width: "300px",
    textAlign: "center",
    backgroundColor: "#fff",
    margin: "0 auto",
  },
  productImage: {
    maxWidth: '100%', // Limits the width, scales down if necessary
    maxHeight: '20rem', // Adjust this value as needed
    height: 'auto', // Maintains the aspect ratio
    display: 'block', // Ensures the image is a block-level element
    margin: '0 auto', // Centers the image if it's smaller than the container
    marginBottom: '10px',
  },
  proceedButton: {
    // Styles for the proceed button
  },
  // Add other styles as needed
  walletBox: {
    position: 'fixed',
    top: '25%',
    left: '20px',
    backgroundColor: 'white',
    padding: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    zIndex: 1000,
  },
};
