import React, { useEffect } from "react";
import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";

function ProductCard({ producer, index }) {
  const productQuality = producer.round.get("productQuality");
  const adStrategy = producer.round.get("adStrategy");
  const productPrice = producer.round.get("productPrice"); // Assuming price is stored in the round data
  const productImage = productQuality === "high" 
    ? "graphics/PremiumToothpasteAI.png" // Replace with actual high-quality image path
    : "graphics/StandardToothpasteAI.png"; // Replace with actual low-quality image path

  const handleBuyProduct = () => {
    // Logic to handle the purchase
    console.log(`Buying one unit of Product ${index + 1}`);
  };

  return (
    <div className="product-card" style={styles.productCard}>
      <h4>Seller: {producer.id}</h4>
      <h3>{`Product ${index + 1}`}</h3>
      <img src={productImage} alt={`Product ${index + 1}`} style={styles.productImage} />
      <p>Advertised Quality: {productQuality}</p>
      <p>Price: ${productPrice}</p>
      {/* <button onClick={handleBuyProduct} style={styles.buyButton}>Challenge this claim</button> */}
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

  
export function DeliberateStage() {
  const player = usePlayer();
  const players = usePlayers();
  const role = player.get("role");

  useEffect(() => {
    if (role === "producer") {
      player.stage.set("submit", true);
    }
  }, [player, role]);

  const handleProceed = () => {
    player.stage.set("submit", true);
  };

  const renderProductFeed = () => {
    return players
      .filter(p => p.get("role") === "producer")
      .map((producer, index) => (
        <ProductCard key={index} producer={producer} index={index} />
      ));
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
        <br/><br/><br/><br/><br/><br/><br/>
        <h1 style = {{fontSize:"2rem"}}>Advertisements</h1>
        <div style={styles.productFeed}>{renderProductFeed()}</div>
        <button onClick={handleProceed} style={styles.proceedButton}>Proceed to Buying</button>
      </div>
    );
  }

  return <div>Unknown role</div>;
}

// Updated styling for the product feed, cards, button, and image
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
    marginBottom: "30px",
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
  productImage: {
    maxWidth: '100%', // Limits the width, scales down if necessary
    maxHeight: '20rem', // Adjust this value as needed
    height: 'auto', // Maintains the aspect ratio
    display: 'block', // Ensures the image is a block-level element
    margin: '0 auto', // Centers the image if it's smaller than the container
    marginBottom: '10px',
  },
  
  buyButton: {
    backgroundColor: '#008CBA',
    color: 'white',
    padding: '10px 20px',
    margin: '10px 0',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  proceedButton: {
    backgroundColor: "#4CAF50",
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
