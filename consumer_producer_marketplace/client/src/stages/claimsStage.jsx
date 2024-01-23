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

function WarrantSelector({ player, warrantAdded, setWarrantAdded }) {
    return (
        <div>
            <div className="container" style={{
                cursor: "pointer",
                paddingLeft: "20px",
                paddingRight: "20px",
                paddingBottom: "20px",
                paddingTop: "20px",
                outline: warrantAdded ? "3px solid #6688FF" : "1px solid #AAAAAA",
                outlineOffset: "3px",
                borderRadius: "15px",
                marginBottom: "20px",
            }} onClick={_ => {
                setWarrantAdded(!warrantAdded);
                player.round.set("warrantAdded", !warrantAdded);
                player.round.set("warrantPrice", !warrantAdded ? 100 : 0);
            }}>
                <input
                    style={{
                        borderRadius: "999px",
                        cursor: "pointer"
                    }}
                    type="checkbox"
                    id="addWarrant"
                    checked={warrantAdded}
                    readOnly={true}
                />
                <div className="option" style={{
                    // textAlign: "center",
                    // color: "#000",
                    // fontSize: "16px",
                    // marginRight: "10px",
                    // width: "370px",
                }}>
                    <h2 style={{fontWeight: "bold", fontSize: "18px"}}>
                        Warrant my Advertisement</h2>
                    <p style={{fontWeight: "normal"}}>This will cost
                        you <b>$100</b><br />Potential customers can see if you have chosen to warrant your advertisement or not, and a warrant can
                            boost your credibility in the marketplace. If your ad is not found to be false, the money spent on your warrant will be fully refunded. However, if your warrant is challenged and your ad is found
                            to be false, the money spent on the warrant will be lost to the challenger – anyone in the market,
                            including a competitor, may challenge this warrant.</p>
                </div>
            </div>
        </div>
    );
}

function AdOption({quality, selectedQuality, onSelectQuality, label, marketPrice, imageSrc}) {
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
            <img src={imageSrc} alt={`${quality} Quality Ad`} style={styles.image}/>
        </div>
    );
}

function InfoDisplay({player, capital, selectedIdx, warrantAdded}) {
    const capitalethisround = player.round.get("capital")
    const unitsAmount = parseInt(capital / player.round.get("productCost"))
    const quality = player.round.get("productQuality")
    const adQuality = selectedIdx === 0 ? "low" : "high";
    const productPrice = selectedIdx === 0 ? "3" : "9";
    const profit = productPrice - player.round.get("productCost")
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
            Advertise as <b>{adQuality ? adQuality : "..."}</b> quality at a price
            of <b>${productPrice ? productPrice : "..."}</b>
            <br/>
            <span role="img" aria-label="units">💲 </span>
            Profit per unit sold: <b>${profit ? profit : "..."}</b>
            <br/>
            <span role="img" aria-label="units">📢 </span>
            Warrant your ad? <b>{warrantAdded ? "Yes" : "No"}</b>

            <br/>
            { /* Don't factor in warrant in total profit calculation, because it may be fully refunded */ }
            <span role="img" aria-label="units">💰 </span>
            Profit if you sell everything: <b>${profit * unitsAmount ? profit * unitsAmount : "..."}</b>

        </div>
    );
}

export function ProfitMarginCalculator(  {producerPlayer} ){

    return(
        <div>
            <div>You choose to produce a <b>{producerPlayer.round.get("productQuality")}</b> quality product
            and advertise it as a <b>{producerPlayer.round.get("adQuality")}</b> quality product.
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
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [warrantAdded, setWarrantAdded] = useState(false);
  const capital = player.round.get("capital")

//   useEffect(() => {
//     if (role === "consumer") {
//       player.stage.set("submit", true);
//     }
//   }, [player, role]);

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

  const handleProceed = () => {
    player.stage.set("submit", true);
  };


  const handleSubmit = () => {
    if (role === "producer" && selectedIdx) {
        player.round.set("productPrice", selectedIdx === 0 ? 3 : 7)
      const productCost = player.round.get("productCost");
      const unitsCanProduce = Math.floor(capital / productCost);
      const warrantPrice = warrantAdded ? 100 : 0;


      // player.round.set("productQuality", productQuality);
      player.round.set("adQuality", selectedIdx === 0 ? "low" : "high");
      player.round.set("warrantAdded", warrantAdded);
      player.round.set("warrantPrice", warrantPrice); // If the warrant is added, another $100 should be deducted from capital. Otherwise, no deductions.
      player.round.set("stock", unitsCanProduce);
      player.round.set("capital", capital - (unitsCanProduce * productCost) - warrantPrice); // Deduct the production cost from capital

      console.log("Stock of this player is", unitsCanProduce);
      player.stage.set("submit", true);
    } else {
      alert("Please select the quality to advertise before proceeding.");
    }
  };

  if (!role) {
    return <div>Loading...</div>;
  }

  if (role === "consumer") {
    return (
      <div style={styles.waitingScreen}>
        <ConsumerWaitingMessage/>
        <button onClick={handleProceed} style={styles.proceedButton}>Proceed to next round</button>
      </div>
    );
  }

  if (role === "producer") {
      const highQualityImg = "/graphics/PremiumToothpasteAI.png";
      const lowQualityImg = "/graphics/StandardToothpasteAI.png";
      // const [selectedIdx, setSelectedIdx] = useState(-1);

    return (
        <div style={styles.producerScreen}>
            { /* No longer needed because of our changed attribute in Game.jsx */}
            {/*<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/> <br/><br/>*/}
            {/*<br/><br/><br/><br/><br/><br/><br/><br/><br/>*/}
            <h1><b>Instructions:</b></h1>

            <h4>In this stage you will choose what quality of toothpaste to produce and how you want to advertise
                it. <br/> Note: Your goal is to maximize your profits.</h4>
            {<InfoDisplay capital={capital} player={player} selectedIdx={selectedIdx} warrantAdded={warrantAdded}/>}

            {/*<ProductQualitySelector*/}
            {/*    selectedQuality={productQuality}*/}
            {/*    onSelectQuality={handleQualitySelection}*/}
            {/*    player={player}*/}
            {/*/>*/}

            {/*<AdQualitySelector*/}
            {/*    selectedQuality={advertisedQuality}*/}
            {/*    onSelectQuality={handleAdStrategySelection}*/}
            {/*/>*/}

            <div style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                margin: "20px",
                marginTop: "50px"
            }}>
                <div style={{cursor: "pointer"}} onClick={_ => setSelectedIdx(0)}>
                    <div className="option" style={{
                        textAlign: "center", padding: "20px",
                        backgroundColor: "#FA6B84",
                        color: "#FFF",
                        border: "none",
                        borderRadius: "15px",
                        outline: selectedIdx === 0 ? "4px solid #FA6B84" : "none",
                        outlineOffset: "3px",
                        fontSize: "16px",
                        marginRight: "10px",
                        width: "370px"
                    }}>
                        <h2 style={{fontWeight: "bold", fontFamily: "Avenir", fontSize: "24px"}}>Advertise as Low
                            Quality</h2>
                        <p style={{fontWeight: "lighter", fontFamily: "Avenir"}}>This will sell for <b>$3</b> in the market</p>
                    </div>
                    <img
                        style={{height: "500px", marginLeft: "108px", marginTop: "10px", borderRadius: "20px"}}
                        src={lowQualityImg} alt="Low quality toothpaste"/>
                </div>
                <div style={{cursor: "pointer"}}
                     onClick={_ => setSelectedIdx(1)}>
                    <div className="option" style={{
                        textAlign: "center", padding: "20px",
                        backgroundColor: "#00CDBB",
                        color: "#FFF",
                        // border: "none",
                        outline: selectedIdx === 1 ? "4px solid #00CDBB" : "none",
                        outlineOffset: "3px",
                        borderRadius: "15px",
                        cursor: "pointer",
                        fontSize: "16px",
                        marginLeft: "10px",
                        width: "370px"
                    }}>
                        <h2 style={{fontWeight: "bold", fontFamily: "Avenir", fontSize: "24px"}}>Advertise as High
                            Quality</h2>
                        <p style={{fontWeight: "lighter", fontFamily: "Avenir"}}>This will sell for <b>$7</b> in the market</p>
                    </div>
                    <img
                        style={{height: "500px", marginLeft: "108px", marginTop: "10px", borderRadius: "20px"}}
                        src={highQualityImg} alt="Low quality toothpaste"/>
                </div>
            </div>

            <WarrantSelector
                player={player}
                warrantAdded={warrantAdded}
                setWarrantAdded={setWarrantAdded}
            />

            {/* <ProfitMarginCalculator producerPlayer={player}/> */}
            <button onClick={handleSubmit} style={styles.submitButton}>Submit choices and go to market</button>
            <br/><br/><br/>
        </div>
    );
  }

    return <div>Unknown role</div>;
}


function ConsumerWaitingMessage() {
    return (
        <div style={styles.waitingScreen}>
            <h2>🕒 Waiting Room 🕒</h2>
            <p>While you wait: </p>
            <ul>
                <li>"What products will be available? 🤔🛍️"</li>
                <li>"Can you spot the best deals? 🕵️🔍"</li>
            </ul>
            <p>Get ready to make smart choices and find the best products! 🧠🎯</p>
            <div style={styles.emoji}>🛒🌟</div>
        </div>
    );
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
        left: '80%', // Center horizontally
        transform: 'translateX(-50%)', // Adjust for centering
        backgroundColor: 'white',
        padding: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        zIndex: 1000,
    },

    waitingScreen: {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        maxWidth: '500px',
        margin: '20px auto',
    },
    emoji: {
        fontSize: '2rem',
        marginTop: '20px',
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
    },
    // ...other styles you might have
};
