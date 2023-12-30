import React, { useState, useEffect } from "react";
import { usePlayer } from "@empirica/core/player/classic/react";

function ProductQualitySelector({ selectedQuality, onSelectQuality, player }) {
  const highQualityImg = "/graphics/PremiumToothpasteAI.png";
  const lowQualityImg = "/graphics/StandardToothpasteAI.png";
  //Should maybe game. variables or factors in the future
  const lowQualityProductionCost = 1
  const highQualityProductionCost = 2

  return (
    <div>
      <h1><b>Choose what quality to produce</b></h1>
      <br/>
      <div style={styles.choicesContainer}>
        <QualityOption
          quality="low"
          selectedQuality={selectedQuality}
          onSelectQuality={onSelectQuality}
          label="Low Quality 🏭⭐"
          productCost = {lowQualityProductionCost}
          imageSrc={lowQualityImg}
        />
        <QualityOption
          quality="high"
          selectedQuality={selectedQuality}
          onSelectQuality={onSelectQuality}
          label="High Quality 🏭⭐⭐⭐"
          productCost = {highQualityProductionCost}
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
  const lowQualityProductPrice = 3
  const highQualityProductPrice = 7

  return (
    <div>
      <h1><b>Choose how you want to advertise your product</b></h1>
      <br/>
      <div style={styles.choicesContainer}>
        <AdOption
          quality="low"
          selectedQuality={selectedQuality}
          onSelectQuality={onSelectQuality}
          label="Advertise as Low Quality 📢⭐"
          marketPrice = {lowQualityProductPrice}
          imageSrc={lowQualityImg}
        />
        <AdOption
          quality="high"
          selectedQuality={selectedQuality}
          onSelectQuality={onSelectQuality}
          label="Advertise as High Quality 📢⭐⭐⭐"
          marketPrice = {highQualityProductPrice}
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

function InfoDisplay({ player, capital }) {
    const capitalethisround = player.round.get("capital")
    const unitsAmount = parseInt(capital / player.round.get("productCost"))
    const quality = player.round.get("productQuality")
    const adQuality = player.round.get("adQuality")
    const productPrice = player.round.get("productPrice")
    const profit = player.round.get("productPrice") - player.round.get("productCost")
    return (
      <div style={styles.infoBox}>
        <b>Choices summary</b> <br/>
        <span role="img" aria-label="capital">💵</span>
        Disposable capital for production: <b>${capitalethisround}</b>
        <br/>
        <span role="img" aria-label="units">🏭</span>
        Produce {unitsAmount ? unitsAmount : "..."} <b>{quality}</b> quality units
        <br/>
        <span role="img" aria-label="units">📢 </span>
        Advertise as <b>{adQuality ? adQuality : "..."}</b>  quality at a price of <b>${productPrice ? productPrice : "..."}</b>
        <br/>
        <span role="img" aria-label="units">💲 </span>
        Profit per unit sold: <b>${profit}</b>
        <br/>
        <span role="img" aria-label="units">💰 </span>
        Profit if you sell everything: <b>${profit*unitsAmount}</b>
       
      </div>
    );
  }
export function ProfitMarginCalculator(  {producerPlayer} ){

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
  const capital = player.round.get("capital")

  useEffect(() => {
    if (role === "consumer") {
      player.stage.set("submit", true);
    }
  }, [player, role]);

  const handleQualitySelection = (quality) => {
    setProductQuality(quality);
    const cost = quality === "high" ? 2 : 1;
    player.round.set("productCost", cost);
    player.round.set("productQuality", quality)
  };

  const handleAdStrategySelection = (quality) => {
    setAdvertisedQuality(quality);
    const price = quality === "high" ? 7 : 3;
    player.round.set("adQuality", quality);
    player.round.set("productPrice", price)
  };

  const handleSubmit = () => {
    if (role === "producer" && productQuality && advertisedQuality) {
      const productCost = player.round.get("productCost");
      const unitsCanProduce = Math.floor(capital / productCost);

      player.round.set("productQuality", productQuality);
      player.round.set("advertisedQuality", advertisedQuality);
      player.round.set("stock", unitsCanProduce);
      player.round.set("capital", capital - (unitsCanProduce * productCost)); // Deduct the production cost from capital

      console.log("Stock of this player is", unitsCanProduce);
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
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/> <br/><br/> 
        <h1><b>Instructions:</b></h1>
        
        <h4>In this stage you will choose what quality of toothpaste to produce and how you want to advertise it. <br/> Note: Your goal is to maximize your profits.</h4>
        <br/>
        { <InfoDisplay capital = {capital} player = {player}/> }
        <ProductQualitySelector
          selectedQuality={productQuality}
          onSelectQuality={handleQualitySelection}
          player = {player}
        />
        
        <AdQualitySelector
          selectedQuality={advertisedQuality}
          onSelectQuality={handleAdStrategySelection}
        />

        {/* <ProfitMarginCalculator producerPlayer={player}/> */}
        <button onClick={handleSubmit} style={styles.submitButton}>Submit choices and go to market</button>
        <br/><br/><br/>
      </div>
    );
  }

  return <div>Unknown role</div>;
}

// Styles
const styles = {
  producerScreen: {
    paddingTop: '40px',
    paddingLeft: '40px',
    paddingBottom: '80px'
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
  infoBox: {
    position: 'fixed',
    bottom: '20px', // Position it 20px from the bottom
    left: '60%', // Center horizontally
    transform: 'translateX(-50%)', // Adjust for centering
    backgroundColor: 'white',
    padding: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    zIndex: 1000,
  },
  
  waitingScreen: {
    // Styles for the waiting screen
    
  }
  // ...other styles you might have
};
