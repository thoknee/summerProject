import React, { useState, useEffect } from "react";
import { usePlayer } from "@empirica/core/player/classic/react";

function ProductQualitySelector({ selectedQuality, onSelectQuality }) {
  const highQualityImg = "/graphics/PremiumToothpasteAI.png";
  const lowQualityImg = "/graphics/StandardToothpasteAI.png";

  return (
    <div>
      <h1><b>Choose what quality to produce</b></h1>
      <div style={styles.choicesContainer}>
        <QualityOption
          quality="low"
          selectedQuality={selectedQuality}
          onSelectQuality={onSelectQuality}
          label="Low Quality ⭐"
          productCost = {4}
          imageSrc={lowQualityImg}
        />
        <QualityOption
          quality="high"
          selectedQuality={selectedQuality}
          onSelectQuality={onSelectQuality}
          label="High Quality ⭐⭐⭐"
          productCost = {9}
          imageSrc={highQualityImg}
        />
      </div>
    </div>
  );
}

function QualityOption({ quality, selectedQuality, onSelectQuality, label, productCost, imageSrc }) {
  return (
    <div style={styles.choice}>
      <label style={styles.label}>
        <input
          type="radio"
          name="productQuality"
          value={quality}
          checked={selectedQuality === quality}
          onChange={() => onSelectQuality(quality)}
        />
        {label}
      </label>
      <p>Production cost: ${productCost}</p>
      <img src={imageSrc} alt={`${quality} Quality Product`} style={styles.image} />
    </div>
  );
}

function AdQualitySelector({ selectedQuality, onSelectQuality }) {
  const highQualityImg = "/graphics/PremiumToothpasteAI.png";
  const lowQualityImg = "/graphics/StandardToothpasteAI.png";

  return (
    <div>
      <h1><b>Choose how you want to advertise your product</b></h1>
      <div style={styles.choicesContainer}>
        <AdOption
          quality="low"
          selectedQuality={selectedQuality}
          onSelectQuality={onSelectQuality}
          label="Advertise as Low Quality 📢⭐"
          marketPrice = {9}
          imageSrc={lowQualityImg}
        />
        <AdOption
          quality="high"
          selectedQuality={selectedQuality}
          onSelectQuality={onSelectQuality}
          label="Advertise as High Quality 📢⭐⭐⭐"
          marketPrice = {15}
          imageSrc={highQualityImg}
        />
      </div>
    </div>
  );
}

function AdOption({ quality, selectedQuality, onSelectQuality, label, marketPrice, imageSrc }) {
  return (
    <div style={styles.choice}>
      <label style={styles.label}>
        <input
          type="radio"
          name="advertisedQuality"
          value={quality}
          checked={selectedQuality === quality}
          onChange={() => onSelectQuality(quality)}
        />
        {label}
      </label>
      <p>Sell for market price of ${marketPrice}</p>
      <img src={imageSrc} alt={`${quality} Quality Ad`} style={styles.image} />
    </div>
  );
}

export function ProfitMarginCalculator(  {producerPlayer} ){

    //producerPlayer.round.set("name", "TonyToothpaste")
    return(
        <div>
            <div>You choose to produce a <b>{producerPlayer.round.get("productQuality")}</b> quality product
            and advertse it as a <b>{producerPlayer.round.get("adQuality")}</b> quality product.
            <br/>
            When you sell it at a price of <b>${producerPlayer.round.get("productPrice")}</b> and
            it costs <b>${producerPlayer.round.get("productCost")}</b> to produce,
            you will earn <b>${producerPlayer.round.get("productPrice") - producerPlayer.round.get("productCost")}</b> profits per unit sold.
            
            </div>
        </div>
        
    )
}

export function ClaimsStage() {
  const player = usePlayer();
  const role = player.get("role");
  const [productQuality, setProductQuality] = useState("");
  const [advertisedQuality, setAdvertisedQuality] = useState("");

  useEffect(() => {
    if (role === "consumer") {
      player.stage.set("submit", true);
    }
  }, [player, role]);

  const handleQualitySelection = (quality) => {
    setProductQuality(quality);
    const cost = quality === "high" ? 9 : 4;
    player.round.set("productCost", cost);
    player.round.set("productQuality", quality)
  };

  const handleAdStrategySelection = (quality) => {
    setAdvertisedQuality(quality);
    const price = quality === "high" ? 15 : 9;
    player.round.set("adQuality", quality);
    player.round.set("productPrice", price)
  };

  const handleSubmit = () => {
    if (role === "producer" && productQuality && advertisedQuality) {
      player.round.set("productQuality", productQuality);
      player.round.set("advertisedQuality", advertisedQuality);
      //player.round.set("productQuality", quality)
      player.stage.set("submit", true);
    } else {
      alert("Please select both product quality and the quality to advertise before proceeding.");
    }
  };

  if (!role) {
    return <div>Loading...</div>;
  }

  if (role === "consumer") {
    return (
      <div style={styles.waitingScreen}>
        <h2>Waiting Screen</h2>
        <p>Producers are currently choosing what to produce. Please wait.</p>
      </div>
    );
  }

  if (role === "producer") {
    return (
      <div style={styles.producerScreen}>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/> 
        <h1><b>Instructions:</b></h1>
        
        <h4>In this stage you will choose what quality of toothpaste to produce and how you want to advertise it. <br/> Note: Your goal is to maximize your profits.</h4>
        <br/>
        <ProductQualitySelector
          selectedQuality={productQuality}
          onSelectQuality={handleQualitySelection}
        />
        
        <AdQualitySelector
          selectedQuality={advertisedQuality}
          onSelectQuality={handleAdStrategySelection}
        />

        <ProfitMarginCalculator producerPlayer={player}/>
        <button onClick={handleSubmit} style={styles.submitButton}>Submit Choices</button>
        <br/><br/><br/>
      </div>
    );
  }

  return <div>Unknown role</div>;
}

// Styles
const styles = {
  producerScreen: {
    paddingTop: '20px',
  },
  choicesContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: '1rem',
  },
  choice: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    marginRight: '10px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  image: {
    maxWidth: '80px',
    height: 'auto',
  },
  submitButton: {
    backgroundColor: '#4CAF50', // Green background
    color: 'white', // White text
    padding: '12px 24px', // Generous padding for better touch area
    fontSize: '16px', // Slightly larger font size
    borderRadius: '5px', // Rounded corners
    border: 'none', // Remove default border
    cursor: 'pointer', // Cursor changes to pointer to indicate it's clickable
    boxShadow: '0 4px #2e7d32', // Shadow effect for depth, darker than background
    transition: 'all 0.2s ease-in-out', // Smooth transition for hover effects
  
    // Hover state
    ':hover': {
      backgroundColor: '#45a049', // Slightly lighter green when hovered
    },
  
    // Active state (when the button is pressed)
    ':active': {
      backgroundColor: '#3e8e41', // Even lighter green to simulate a press
      boxShadow: '0 2px #2e7d32', // Reduce the shadow to simulate being pressed
      transform: 'translateY(2px)', // Slightly shift the button down
    }
  },
  
  waitingScreen: {
    // Styles for the waiting screen
    
  }
  // ...other styles you might have
};
