import React, { useState, useEffect } from "react";
import { usePlayer } from "@empirica/core/player/classic/react";
import { WarrantModal } from "../components/WarrantModal";
import warrants from "../../data.json"
import { PayoffMatrix } from "../components/PayoffMatrix";

// import { Button } from "../components/Button";  // @shahabhishek1729

function ProductQualitySelector({ selectedQuality, onSelectQuality, player }) {
  const highQualityImg = "/graphics/PremiumToothpasteAI.png";
  const lowQualityImg = "/graphics/StandardToothpasteAI.png";
  //Should maybe game. variables or factors in the future
  const lowQualityProductionCost = 1
  const highQualityProductionCost = 2

  const qualityOptions = [
    { quality: "low", label: "Low Quality 🏭⭐", productCost: lowQualityProductionCost, imageSrc: lowQualityImg },
    { quality: "high", label: "High Quality 🏭⭐⭐⭐", productCost: highQualityProductionCost, imageSrc: highQualityImg },
  ];


  return (
    <div>
      <h1><b>Choose what quality to produce</b></h1>
      <br />
      {qualityOptions.map((option) => (
        <QualityOption
          key={option.quality}
          {...option}
          selectedQuality={selectedQuality}
          onSelectQuality={onSelectQuality}
        />
      ))}
    </div>
  );
}

// function QualityOption({ quality, selectedQuality, onSelectQuality, label, productCost, imageSrc }) {
//   return (
//     <div style={styles.choice}>
//       <label style={styles.label}>
//         <input
//           type="radio"
//           name="productQuality"
//           value={quality}
//           checked={selectedQuality === quality}
//           onChange={() => onSelectQuality(quality)}
//         />
//         {label}
//       </label>
//       <p>Production cost: ${productCost}</p>
//       <img src={imageSrc} alt={`${quality} Quality Product`} style={styles.image} />
//     </div>
//   );
// }

function AdQualitySelector({ selectedQuality, onSelectQuality }) {
  const highQualityImg = "/graphics/PremiumToothpasteAI.png";
  const lowQualityImg = "/graphics/StandardToothpasteAI.png";
  const lowQualityProductPrice = 3
  const highQualityProductPrice = 7

  return (
    <div>
      <h1><b>Choose how you want to advertise your product</b></h1>
      <br />
      <div style={styles.choicesContainer}>
        <AdOption
          quality="low"
          selectedQuality={selectedQuality}
          onSelectQuality={onSelectQuality}
          label="Advertise as Low Quality 📢⭐"
          marketPrice={lowQualityProductPrice}
          imageSrc={lowQualityImg}
        />
        <AdOption
          quality="high"
          selectedQuality={selectedQuality}
          onSelectQuality={onSelectQuality}
          label="Advertise as High Quality 📢⭐⭐⭐"
          marketPrice={highQualityProductPrice}
          imageSrc={highQualityImg}
        />
      </div>
    </div>
  );
}

function WarrantSelector({ player, warrantAdded, setWarrantAdded }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false);
  const [selectedWarrant, setSelectedWarrant] = useState(null);
  const [isSelected, setIsSelected] = useState("");

  const onWarrantAddition = () => {
    setIsModalOpen(true);
  };

  const onWarrantSelection = (e, price, description) => {
    if (warrantAdded) {
      player.round.set("warrantDesc", description);
      player.round.set("warrantPrice", price);
      console.log("Description", description);
      setIsSelected(description);
      setSelectedWarrant(description);
    }
  };
  const onWarrantDeselection = () => {
    player.round.set("warrantDesc", "");
    player.round.set("warrantPrice", 0);
    setIsSelected("");
    setSelectedWarrant(null);
    console.log("Warrant deselected");
  };
  const removeWarrants = (warrantAdded) => {
    if (warrantAdded == false) {

      player.round.set("warrantDesc", "")
      player.round.set("warrantPrice", 0);
      setIsSelected("");
      console.log("Warrant removed");
    }
  }

  useEffect(() => {
    if (!isCheckboxSelected) {
      onWarrantDeselection();
    }
  }, [isCheckboxSelected]);

  const selectedCardStyle = {
    backgroundColor: "rgba(0, 0, 255, 0.2)",
    borderRadius: "6px",
    padding: "10px",
  }
  return (
    <div className="flex justify-center items-center">
      <div className="container cursor-pointer p-[20px] mb-[20px] w-1/2" style={{
        outline: warrantAdded ? "3px solid #6688FF" : "1px solid #AAAAAA",
        outlineOffset: "3px",
        borderRadius: "15px",
      }}>
        <input
        className="rounded-full cursor-pointer"
          type="checkbox"
          id="addWarrant"
          checked={isCheckboxSelected}
          onClick={() => {
            setWarrantAdded(!isCheckboxSelected);
            setIsCheckboxSelected(!isCheckboxSelected);
            if (!isCheckboxSelected) {
              setSelectedWarrant(null);
            }
          }}
          readOnly={true}
        />
        <div className="option">
          <div className="flex justify-between">
            <h2 style={{ fontWeight: "bold", fontSize: "18px" }}>
              Warrant my Advertisement
            </h2>
            {isCheckboxSelected && (
              <button
                className={`bg-blue-400 p-2 rounded-lg ${selectedWarrant ? "" : "bg-red-400"
                  }`}
                disabled={!isCheckboxSelected}
                onClick={onWarrantAddition}
              >
                {selectedWarrant ? "Warrant Selected" : "Select Warrant"}
              </button>
            )}
          </div>
          <p style={{ fontWeight: "normal" }}>This will cost
            you <b>$100</b><br />Potential customers can see if you have chosen to warrant your advertisement or not, and a warrant can
            boost your credibility in the marketplace. If your ad is not found to be false, the money spent on your warrant will be fully refunded. However, if your warrant is challenged and your ad is found
            to be false, the money spent on the warrant will be lost to the challenger – anyone in the market,
            including a competitor, may challenge this warrant.</p>
        </div>
      </div>

      <WarrantModal isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);

          // setSelectedCards(initialSelectedCards.map((_, index) => index));
        }}
        title="Warrant" children={
          <>
            {Array.isArray(warrants) && warrants.length > 0 && (
              <div className="flex justify-center space-x-4">
                {warrants.map((warrant, index) => {
                  return (
                    <div
                      style={isSelected === warrant.description ? selectedCardStyle : {}}
                      className="flex flex-col items-center cursor-pointer select:border-2 border-black"
                      key={index}
                      onClick={(e) => {
                        if (isSelected === warrant.description) {
                          onWarrantDeselection();
                        }
                        onWarrantSelection(e, warrant.price, warrant.description, warrantAdded);
                      }}
                    >
                      <img src={warrant.icon} alt="icon" className="mb-2 max-w-full h-auto rounded-lg" />
                      <h1 className="font-bold text-center mb-4">{warrant.description}</h1>
                      <h1 className="font-semibold text-xl text-center"><span style={{ color: "green" }}>${warrant.price}</span></h1>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        } />
    </div>
  );
}
//
// function AdOption({quality, selectedQuality, onSelectQuality, label, marketPrice, imageSrc}) {
//     return (
//         <div style={styles.choice}>
//             <label style={styles.label}>
//                 <input
//                     type="radio"
//                     name="advertisedQuality"
//                     value={quality}
//                     checked={selectedQuality === quality}
//                     onChange={() => onSelectQuality(quality)}
//                 />
//                 {label}
//             </label>
//             <p>Sell for market price of ${marketPrice}</p>
//             <img src={imageSrc} alt={`${quality} Quality Ad`} style={styles.image}/>
//         </div>
//     );
// }

function InfoDisplay({ player, capital, selectedIdx, warrantAdded }) {
  const capitalethisround = player.round.get("capital")
  const unitsAmount = parseInt(capital / player.round.get("productCost"))
  const quality = player.round.get("productQuality")
  const adQuality = selectedIdx === 0 ? "low" : "high";
  const productPrice = selectedIdx === 0 ? "3" : "9";
  const profit = productPrice - player.round.get("productCost")
  return (
    <div style={styles.infoBox}>
      <b>Choices summary</b> <br />
      <span role="img" aria-label="capital">💵</span>
      Disposable capital for production: <b>${capitalethisround}</b>
      <br />
      <span role="img" aria-label="units">🏭</span>
      Produce {unitsAmount ? unitsAmount : "..."} <b>{quality}</b> quality units
      <br />
      <span role="img" aria-label="units">📢 </span>
      Advertise as <b>{adQuality ? adQuality : "..."}</b> quality at a price
      of <b>${productPrice ? productPrice : "..."}</b>
      <br />
      <span role="img" aria-label="units">💲 </span>
      Profit per unit sold: <b>${profit ? profit : "..."}</b>
      <br />
      <span role="img" aria-label="units">📢 </span>
      Warrant your ad? <b>{warrantAdded ? "Yes" : "No"}</b>

      <br />
      { /* Don't factor in warrant in total profit calculation, because it may be fully refunded */}
      <span role="img" aria-label="units">💰 </span>
      Profit if you sell everything: <b>${profit * unitsAmount ? profit * unitsAmount : "..."}</b>

    </div>
  );
}

function QualityOption({ quality, imgUrl, selectedIdx, setSelectedIdx }) {
  const qualityCapitalized = quality[0].toUpperCase() + quality.slice(1);
  // TODO: Remove hardcoded prices: price = (cost + value) / 2
  const price = quality === "low" ? "3" : "7";
  const backgroundColor = quality === "low" ? "#FA6B84" : "#00CDBB";
  const qualityIdx = quality === "low" ? 0 : 1;

  return <div className="text-center flex flex-col justify-center items-center" style={{ cursor: "pointer" }} onClick={_ => setSelectedIdx(qualityIdx)}>
    <div className="option" style={{
      textAlign: "center", padding: "20px",
      backgroundColor: backgroundColor,
      color: "#FFF",
      border: "none",
      borderRadius: "15px",
      outline: selectedIdx === qualityIdx ? `4px solid ${backgroundColor}` : "none",
      outlineOffset: "3px",
      fontSize: "16px",
      marginRight: "10px",
      width: "370px"
    }}>
      <h2 style={{ fontWeight: "bold", fontFamily: "Avenir", fontSize: "24px" }}>Advertise as {qualityCapitalized + " "}
        Quality</h2>
      <p style={{ fontWeight: "lighter", fontFamily: "Avenir" }}>This will sell for ${price} in the market</p>
    </div>
    <img className="mb-6"
      style={{ height: "375px", marginTop: "25px", borderRadius: "20px", filter: "drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.2))" }}
      src={imgUrl} alt="Low quality toothpaste" />
  </div>
}

export function ProfitMarginCalculator({ producerPlayer }) {

  return (
    <div>
      <div>You choose to produce a <b>{producerPlayer.round.get("productQuality")}</b> quality product
        and advertise it as a <b>{producerPlayer.round.get("adQuality")}</b> quality product.
        <br />
        When you sell it at a price of <b>${producerPlayer.round.get("productPrice")}</b> and
        it costs <b>${producerPlayer.round.get("productCost")}</b> to produce,
        you will
        earn <b>${producerPlayer.round.get("productPrice") - producerPlayer.round.get("productCost")}</b> profits
        per unit sold.

      </div>
    </div>

  )
}

export function ClaimsStage(roundNumber) {
  const player = usePlayer();
  const role = player.get("role");
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [warrantAdded, setWarrantAdded] = useState(false);
  const capital = player.round.get("capital")

  // Default values for player, to avoid read error for later stages
  player.round.set("productCost", 2);
  player.round.set("productionQuality", "high");
  player.round.set("adQuality", "high");
  player.round.set("productPrice", 7);

    useEffect(() => {
      if (role === "consumer") {
        player.stage.set("submit", true);
      }
    }, [player, role]);

  function adjSelector(quality) {
    // Returns an descriptive adj dependent on player ad quality
    const baseProducerName = player.round.get("baseProducerName");
    const adjPos = ["excellent", "premium", "superior", "legendary"];
    const adjNeg = ["expired", "weak", "obsolete", "cheap", "crappy"];
    const chosenAdj = quality === "high"
      ? adjPos[Math.floor(Math.random() * adjPos.length)]
      : adjNeg[Math.floor(Math.random() * adjNeg.length)];
    return `${baseProducerName} ${chosenAdj}'s toothpaste`;
  }
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
    player.round.set("producerName", adjSelector(quality))
  };

  const handleProceed = () => {
    player.stage.set("submit", true);
  };

  // console.log(roundNumber)

  const handleSubmit = () => {
    if (role === "producer" && selectedIdx !== -1) {
      if (warrantAdded && player.round.get("warrantDesc") == "") {
        alert("Please select the Warrant option to continue!");
        return;
      }
      const productCost = player.round.get("productCost");
      console.log("product cost: ",productCost);
      console.log("capital: ",capital)
      const unitsCanProduce = Math.floor(capital / productCost);
      console.log(unitsCanProduce);
      console.log(productCost)
      // player.set(roundNumber.concat("_choices"),
      //     [
            player.round.set("productPrice", selectedIdx === 0 ? 3 : 7),
            player.round.set("adQuality", selectedIdx === 0 ? "low" : "high"),
            player.round.set("warrantAdded", warrantAdded),
            player.round.set("stock", unitsCanProduce),
            player.round.set("capital", capital - unitsCanProduce * productCost), // Deduct the production cost from capital
            player.round.set("producerName", adjSelector(player.round.get("adQuality")))
          // ])
      // console.log("Prod price in handle: ", player.round.get("_choices")[4]);
      // player.round.set("productPrice", selectedIdx === 0 ? 3 : 7)
      // const productCost = player.round.get("productCost");
      // const unitsCanProduce = Math.floor(capital / productCost);
      // const warrantPrice = warrantAdded ? 100 : 0;
      // player.round.set("adQuality", selectedIdx === 0 ? "low" : "high");
      // player.round.set("warrantAdded", warrantAdded);
      // // player.round.set("warrantPrice", warrantPrice); // For now, the warrant price is hard-coded to 100
      // player.round.set("stock", unitsCanProduce);
      // player.round.set("capital", capital - unitsCanProduce * productCost); // Deduct the production cost from capital
      // player.round.set("producerName", adjSelector(player.round.get("adQuality")));
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
        <ConsumerWaitingMessage />
        <button onClick={handleProceed} style={styles.proceedButton}>Proceed to next round</button>
      </div>
    );
  }

  if (role === "producer") {
    const highQualityImg = "/graphics/PremiumToothpasteAI.png";
    const lowQualityImg = "/graphics/StandardToothpasteAI.png";
    // const [selectedIdx, setSelectedIdx] = useState(-1);

    return (

      <div className="flex flex-col -top-6 justify-center border-3 border-indigo-800 p-6 rounded-lg h-full shadow-md relative p-10 mt-32">
        <h1 className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-yellow-200 border-2 border-teal-600 pl-2 pr-2 rounded-lg text-lg mb-4" style={{ fontFamily: "'Archivo', sans-serif", whiteSpace: 'nowrap', textAlign: 'center' }}>
          <b>Choose how you want to Advertise</b>{" "}<br /> Note: Your goal is to maximize your profits.
        </h1>

        {<InfoDisplay capital={capital} player={player} selectedIdx={selectedIdx} warrantAdded={warrantAdded} />}

        {/*<ProductQualitySelector*/}
        {/*    selectedQuality={productQuality}*/}
        {/*    onSelectQuality={handleQualitySelection}*/}
        {/*    player={player}*/}
        {/*/>*/}

        {/*<AdQualitySelector*/}
        {/*    selectedQuality={advertisedQuality}*/}
        {/*    onSelectQuality={handleAdStrategySelection}*/}
        {/*/>*/}

        <div className="flex justify-center gap-10 items-center">
          <QualityOption
            quality="low"
            imgUrl={lowQualityImg}
            selectedIdx={selectedIdx}
            setSelectedIdx={setSelectedIdx} />
          <QualityOption
            quality="high"
            imgUrl={highQualityImg}
            selectedIdx={selectedIdx}
            setSelectedIdx={setSelectedIdx} />
        </div>

        <WarrantSelector
          player={player}
          warrantAdded={warrantAdded}
          setWarrantAdded={setWarrantAdded}
        // onWarrantAddition={handleWarrantAddition}
        />

        {/* <ProfitMarginCalculator producerPlayer={player}/> */}
        <div className="flex justify-center items-center">
          <button onClick={handleSubmit} className="p-2 rounded-md border-transparent shadow-sm text-white bg-empirica-600 hover:bg-empirica-700">Submit choices and go to market</button>
        </div>

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

      <br />

      <p>For convenience, the table below represents how many points you would gain/lose for each possible combination of the quality you pay for and the quality you actually receive:</p>
      {/* TODO: Remove hardcoded costs and values */}
      <PayoffMatrix cost_hi={2} cost_lo={1} value_hi={12} value_lo={5} />

      <br />

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
