import React, { useState, useEffect } from "react";
import { usePlayer } from "@empirica/core/player/classic/react";

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
  };

  const handleAdStrategySelection = (quality) => {
    setAdvertisedQuality(quality);
    const cost = quality === "high" ? 30 : 10;
    player.round.set("adCost", cost);
  };

  const handleSubmit = () => {
    if (role === "producer" && productQuality && advertisedQuality) {
      player.round.set("productQuality", productQuality);
      player.round.set("advertisedQuality", advertisedQuality);
      player.stage.set("submit", true);
    } else {
      alert("Please select both product quality and the quality to advertise before proceeding.");
    }
  };

  // Placeholder paths for product images
  const highQualityImg = "/graphics/PremiumToothpasteAI.png";
  const lowQualityImg = "/graphics/StandardToothpasteAI.png";

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
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <h1><b>Instructions:</b></h1>
        <h4>In this stage you will choose what quality of toothpaste to produce and how you want to advertise it. <br/> Note: Your goal is to maximize your profits.</h4>
        <br/><br/>
        <h2>Choose what quality to produce</h2>
        <p> </p>
        <div style={styles.choicesContainer}>
          <div style={styles.choice}>
            <label style={styles.label}>
              <input
                type="radio"
                name="productQuality"
                value="high"
                checked={productQuality === "high"}
                onChange={() => handleQualitySelection("high")}
              />
              High Quality <span role="img" aria-label="high quality">⭐⭐⭐</span>
            </label>
            <img src={highQualityImg} alt="High Quality Product" style={styles.image} />
          </div>
          <div style={styles.choice}>
            <label style={styles.label}>
              <input
                type="radio"
                name="productQuality"
                value="low"
                checked={productQuality === "low"}
                onChange={() => handleQualitySelection("low")}
              />
              Low Quality <span role="img" aria-label="low quality">⭐</span>
            </label>
            <img src={lowQualityImg} alt="Low Quality Product" style={styles.image} />
          </div>
        </div>
        <h1>Choose how you want to advertise your product</h1> <br/>
        <div style={styles.choicesContainer}>
          <div style={styles.choice}>
            <label style={styles.label}>
              <input
                type="radio"
                name="advertisedQuality"
                value="high"
                checked={advertisedQuality === "high"}
                onChange={() => handleAdStrategySelection("high")}
              />
              Advertise as High Quality <span role="img" aria-label="advertise high">📢⭐⭐⭐</span>
            </label>
            <img src={highQualityImg} alt="Advertise as High Quality" style={styles.image} />
          </div>
          <div style={styles.choice}>
            <label style={styles.label}>
              <input
                type="radio"
                name="advertisedQuality"
                value="low"
                checked={advertisedQuality === "low"}
                onChange={() => handleAdStrategySelection("low")}
              />
              Advertise as Low Quality <span role="img" aria-label="advertise low">📢⭐</span>
            </label>
            <img src={lowQualityImg} alt="Advertise as Low Quality" style={styles.image} />
          </div>
        </div>
        <button onClick={handleSubmit} style={styles.submitButton}>Submit Choices</button>
      </div>
    );
  }

  return <div>Unknown role</div>;
}

function ProductQualitySelector({ selectedQuality, onSelectQuality, imageHigh, imageLow }) {
    return (
      <div style={styles.choicesContainer}>
        <div style={styles.choice}>
          <label style={styles.label}>
            <input
              type="radio"
              name="productQuality"
              value="high"
              checked={selectedQuality === "high"}
              onChange={() => onSelectQuality("high")}
            />
            High Quality <span role="img" aria-label="high quality">⭐⭐⭐</span>
          </label>
          <img src={imageHigh} alt="High Quality Product" style={styles.image} />
        </div>
        <div style={styles.choice}>
          <label style={styles.label}>
            <input
              type="radio"
              name="productQuality"
              value="low"
              checked={selectedQuality === "low"}
              onChange={() => onSelectQuality("low")}
            />
            Low Quality <span role="img" aria-label="low quality">⭐</span>
          </label>
          <img src={imageLow} alt="Low Quality Product" style={styles.image} />
        </div>
      </div>
    );
  }

  
  function AdQualitySelector({ selectedQuality, onSelectQuality, imageHigh, imageLow }) {
  return (
    <div style={styles.choicesContainer}>
      <div style={styles.choice}>
        <label style={styles.label}>
          <input
            type="radio"
            name="advertisedQuality"
            value="high"
            checked={selectedQuality === "high"}
            onChange={() => onSelectQuality("high")}
          />
          Advertise as High Quality <span role="img" aria-label="advertise high">📢⭐⭐⭐</span>
        </label>
        <img src={imageHigh} alt="Advertise as High Quality" style={styles.image} />
      </div>
      <div style={styles.choice}>
        <label style={styles.label}>
          <input
            type="radio"
            name="advertisedQuality"
            value="low"
            checked={selectedQuality === "low"}
            onChange={() => onSelectQuality("low")}
          />
          Advertise as Low Quality <span role="img" aria-label="advertise low">📢⭐</span>
        </label>
        <img src={imageLow} alt="Advertise as Low Quality" style={styles.image} />
      </div>
    </div>
  );
}


// Updated styles
const styles = {
  producerScreen: {
    paddingTop: '20px', // Add space to the top of the producer screen
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
    marginBottom: '10px', // Space between label and image
  },
  image: {
    maxWidth: '80px', // 20% smaller than the original size of 100px
    height: 'auto',
  },
  submitButton: {
    // Your styles for the submit button
  },
  // ...other styles you might have
};
