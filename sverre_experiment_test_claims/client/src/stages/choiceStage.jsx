import React, { useState, useEffect } from "react";
import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";

function ConsumerProductCard({ producer, index, handlePurchase, wallet }) {
  const productQuality = producer.round.get("productQuality");
  const price = producer.round.get("productPrice"); // Replace with actual logic to get price
  const productImage = productQuality === "high" 
    ? "graphics/PremiumToothpasteAI.png" // High-quality image path
    : "graphics/StandardToothpasteAI.png"; // Low-quality image path

  return (
    <div className="product-card" style={styles.productCard}>
      <h3>{`Ad # ${index + 1}`}</h3>
      <h4>Seller: {producer.id}</h4>
      <h3>{producer.round.get("producerName")}</h3>
      <img src={productImage} alt={`Product ${index + 1}`} style={styles.productImage} />
      <p>Quality: {productQuality}</p>
      <p>Price: ${price}</p>
      <button style = {styles.buyButton} onClick={() => handlePurchase(price, `Product ${index + 1}`)} disabled={wallet < price}>Buy</button>
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
  const [wallet, setWallet] = useState(player.round.get("wallet") || 0);

  const handleProceed = () => {
    player.stage.set("submit", true);
  };

  const handlePurchase = (cost, productId, producerId) => {
    console.log("Consumer attempts to buy")
    if (wallet >= cost) {
      // Update wallet
      const newWalletValue = wallet - cost;
      setWallet(newWalletValue);
      player.set("wallet", newWalletValue);
  
      // Increment unitsSold for the producer
      const producerIndex = players.findIndex(p => p.id === producerId);
      if (producerIndex !== -1) {
      // Directly access and update the unitsSold for the producer
      let unitsSold = players[producerIndex].round.get("unitsSold") || 0;
      unitsSold += 1; // Assuming each purchase is for one unit
      players[producerIndex].round.set("unitsSold", unitsSold);
    }
  
      // Update basket for the consumer
      let basket = player.round.get("basket") || {};
      if (basket[productId]) {
        basket[productId] += 1; // Increment quantity if already bought
      } else {
        basket[productId] = 1; // Add new product with quantity 1
      }
      console.log("player basket updates", player.round.get("basket"))
      player.round.set("basket", basket);
  
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

//   useEffect(() => {
//     if (role === "producer") {
//       player.stage.set("submit", true);
//     }
//   }, [player, role]);

  if (!role) {
    return <div>Loading...</div>;
  }

  if (role === "producer") {
    let unitsSold = player.round.get("unitsSold")
    return (
      <div style={styles.waitingScreen}>
        <h2>Waiting Screen</h2>
        <p>Wait for consumers to make their choices...</p>
        <p>You have currently sold {unitsSold} units.</p>
        <button onClick={handleProceed} style={styles.proceedButton}>Proceed to next round</button>
      </div>
    );
  }

  if (role === "consumer") {
    return (
      <div>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <h2>Advertisements</h2>
        <h3>You can only buy if you have enough money in your wallet.</h3>
        <WalletDisplay wallet={wallet} />
        <div style={styles.productFeed}>{renderProductFeed()}</div>
        <br/><br/>
        <button onClick={handleProceed} style={styles.proceedButton}>Proceed to next round</button>
        <br/><br/><br/><br/>
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
  buyButton: {
    backgroundColor: '#008CBA', // Blue background
    color: 'white', // White text
    padding: '10px 20px', // Padding
    fontSize: '14px', // Font size
    borderRadius: '4px', // Rounded corners
    border: 'none', // Remove default border
    cursor: 'pointer', // Cursor to pointer
    boxShadow: '0 3px #005f73', // Shadow effect for depth
    transition: 'all 0.2s ease', // Smooth transition for hover effects
    margin: '10px 0', // Margin top and bottom
  
    ':hover': {
      backgroundColor: '#0077b6', // Slightly lighter blue when hovered
      boxShadow: '0 2px #005f73', // Adjust shadow for hover effect
    },
  
    ':disabled': {
      backgroundColor: '#cccccc', // Disabled state color
      cursor: 'not-allowed', // Change cursor for disabled state
      boxShadow: 'none',
    }
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
