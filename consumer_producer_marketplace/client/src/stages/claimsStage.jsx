/* 

*/
import React, { useState, useEffect } from "react";
import {
  useGame,
  usePlayer,
  useRound,
} from "@empirica/core/player/classic/react";
import { WarrantModal } from "../components/WarrantModal";
import { PayoffMatrix } from "../components/PayoffMatrix";
import { toast } from "react-toastify";

export function ClaimsStage() {
  const player = usePlayer();
  const round = useRound();
  const role = player.get("role");
  const game = useGame();
  const treatment = game.get("treatment");
  const marketType = treatment["marketType"];
  // useEffect(() => {
  //   if (role === "consumer") {
  //     player.stage.set("submit", true);
  //   }
  // }, [player, role]);

  if (role === "producer") {
    const productCost = player.round.get("productCost");
    let selectedProduct = player.round.get("selectedProduct");
    console.log("Selected Product: ", selectedProduct);
    const { low, high, category, productWarrants } = selectedProduct;
    console.log(low.productPrice, high.productPrice);
    let productID = player.round.get("productID");
    let brandName = player.round.get("brandName");
    let productQuality = player.round.get("productQuality");
    // let [warrantAdded, setWarrantAdded] = useState(false);
    let [capital, setCapital] = useState(player.get("capital"));
    console.log("Capital current: ", capital)
    let [productPrice, setProductPrice] = useState(0);
    let [productAdQuality, setProductAdQuality] = useState("");
    let [productAdImage, setProductAdImage] = useState("");
    let [productAdName, setproductAdName] = useState("");
    let [value, setValue] = useState(0)
    let [isModalOpen, setIsModalOpen] = useState(false);
    let [isCheckboxSelected, setIsCheckboxSelected] = useState(false);
    // let [selectedWarrant, setSelectedWarrant] = useState("");
    // let [isSelected, setIsSelected] = useState("");

    let [profit, setProfit] = useState(0);
    // let productIdentifier = "";
    let [iniStock, setIniStock] = useState(0);
    let stock = player.get("stock") || [];
    let [updatedStock, setUpdatedStock] = useState({
      // producerID: player.id,
      // productID: productID,
      // productIdentifier: "",
      // productQuality: productQuality,
      // productAdQuality: productAdQuality,
      // productCost: productCost,
      // productPrice: productPrice,
      // productAdImage: productAdImage,
      // initialStock: 0,
      // remainingStock: 0,
      // soldStock: 0,
      // round: round.get("name")

    });
    let warrants = player.get("warrants") || [];
    let [updateWarrants, setUpdateWarrants] = useState({
      // producerID: player.id,
      // productID: productID,
      // productQuality: productQuality,
      // productAdQuality: "",
      // warrantAdded: false,
      // warrantPrice: 0,
      // warrantDesc: "",
      // challengeAmount: 0,
      // round: round.get("name")
    });
    let [tempStock, setTempStock] = useState(0);

    // useEffect(() => {
    //   console.log("Use eff 1st", productAdQuality);
    //   if(stock.length != 0){
    //   stock.find((product) => {
    //     if (
    //       product.productID === productID &&
    //       product.productQuality === productQuality &&
    //       product.productAdQuality === productAdQuality
    //     ) {
    //       setUpdatedStock(product);
    //       setUpdatedStock({
    //         ...updatedStock,
    //         initialStock: product.remainingStock,
    //         remainingStock: product.remainingStock,
    //         round: round.get("name"),
    //       });
    //       setTempStock(product.remainingStock);
    //       console.log("1st Use eff 1st if", capital);
    //     } else {
    //       setUpdatedStock({
    //         producerID: player.id,
    //         productID: productID,
    //         productIdentifier: "",
    //         productQuality: productQuality,
    //         productAdQuality: productAdQuality,
    //         productCost: productCost,
    //         productPrice: productPrice,
    //         productAdImage: productAdImage,
    //         initialStock: 0,
    //         remainingStock: 0,
    //         soldStock: 0,
    //         round: round.get("name")
    //       });
    //       setTempStock(0);
    //       console.log("1st Use eff 1st else", capital);

    //     }
    //   });
    // }
    
    //   if(warrants.length != 0){
    //   warrants.find((warrant) => {
    //     if (
    //       warrant.productID === productID &&
    //       warrant.productQuality === productQuality &&
    //       warrant.productAdQuality === productAdQuality
    //     ) {
    //       setUpdateWarrants(warrant);
    //       setUpdateWarrants({
    //         ...updateWarrants,
    //         round: round.get("name"),
    //       });
    //       setIsCheckboxSelected(true);
    //       console.log("1st Use eff 2nd if", capital);
    //     } else {
    //       setUpdateWarrants({
    //         producerID: player.id,
    //         productID: productID,
    //         productQuality: productQuality,
    //         productAdQuality: productAdQuality,
    //         warrantAdded: false,
    //         warrantPrice: 0,
    //         warrantDesc: "",
    //         challengeAmount: 0,
    //         round: round.get("name")
    //       });
    //       setIsCheckboxSelected(false);
    //       console.log("1st Use eff 2nd else", capital);

    //     }
    //   });
    // }
    // }, [productAdQuality]);

    const updateStock = ({price, imgUrl, quality, name, value}) => {
      if(stock.length != 0){
        stock.find((product) => {
          if (
            product.productID === productID &&
            product.productQuality === productQuality &&
            product.productAdQuality === productAdQuality
          ) {
            setUpdatedStock(product);
            setUpdatedStock({
              ...updatedStock,
              initialStock: product.remainingStock,
              remainingStock: product.remainingStock,
              round: round.get("name"),
            });
            setTempStock(product.remainingStock);
            setIniStock(product.remainingStock);
            console.log("1st Use eff 1st if", capital);
          } else {
            setUpdatedStock({
              producerID: player.id,
              productID: productID,
              productIdentifier: name,
              productQuality: productQuality,
              productAdQuality: quality,
              productCost: productCost,
              productPrice: price,
              productAdImage: imgUrl,
              value: value,
              initialStock: 0,
              remainingStock: 0,
              soldStock: 0,
              round: round.get("name")
            });
            setTempStock(0);
            setIniStock(0);
            console.log("1st Use eff 1st else", capital);
  
          }
        });
      }
      else{
        setUpdatedStock({
          producerID: player.id,
          productID: productID,
          productIdentifier: name,
          productQuality: productQuality,
          productAdQuality: quality,
          productCost: productCost,
          productPrice: price,
          productAdImage: imgUrl,
          value: value,
          initialStock: 0,
          remainingStock: 0,
          soldStock: 0,
          round: round.get("name")
        });
        setTempStock(0);
        setIniStock(0);
        console.log("1st Use eff 1st else", capital);
      }
    }

    const updateWarrant = () => {
      if(warrants.length != 0){
        warrants.find((warrant) => {
          if (
            warrant.productID === productID &&
            warrant.productQuality === productQuality &&
            warrant.productAdQuality === productAdQuality
          ) {
            setUpdateWarrants(warrant);
            setUpdateWarrants({
              ...updateWarrants,
              round: round.get("name"),
            });
            setIsCheckboxSelected(true);
            console.log("1st Use eff 2nd if", capital);
          } else {
            setUpdateWarrants({
              producerID: player.id,
              productID: productID,
              productQuality: productQuality,
              productAdQuality: productAdQuality,
              warrantAdded: false,
              warrantPrice: 0,
              warrantDesc: "",
              challengeAmount: 0,
              round: round.get("name")
            });
            setIsCheckboxSelected(false);
            console.log("1st Use eff 2nd else", capital);
  
          }
        });
      }
      else{
        setUpdateWarrants({
          producerID: player.id,
          productID: productID,
          productQuality: productQuality,
          productAdQuality: productAdQuality,
          warrantAdded: false,
          warrantPrice: 0,
          warrantDesc: "",
          challengeAmount: 0,
          round: round.get("name")
        });
        setIsCheckboxSelected(false);
        console.log("1st Use eff 2nd else", capital);
      }
    }

    useEffect(() => {
      if (isCheckboxSelected == true) {
        warrants.find((warrant) => {
          if (
            warrant.productID === productID &&
            warrant.productQuality === productQuality &&
            warrant.productAdQuality === productAdQuality
          ) {
            setUpdateWarrants(warrant);
            setUpdateWarrants({
              ...updateWarrants,
              round: round.get("name"),
            });
            setCapital(Number(capital) - Number(warrant.warrantPrice));
            console.log("2nd Use eff 1st if", capital);

          } else {
            setUpdateWarrants({
              producerID: player.id,
              productID: productID,
              productQuality: productQuality,
              productAdQuality: productAdQuality,
              warrantAdded: false,
              warrantPrice: 0,
              warrantDesc: "",
              challengeAmount: 0,
              round: round.get("name"),
            });
            console.log("2nd Use eff 1st else", capital);
          }
        });
      }
      else {
        // console.log("Warrnats initial price: ", updateWarrants.warrantPrice)
        if (updateWarrants.warrantPrice == undefined) {
          setUpdateWarrants({
            producerID: player.id,
            productID: productID,
            productQuality: productQuality,
            productAdQuality: productAdQuality,
            warrantAdded: false,
            warrantPrice: 0,
            warrantDesc: "",
            challengeAmount: 0,
            round: round.get("name"),
          });
        }
        else {
          setCapital(Number(capital) + Number(updateWarrants.warrantPrice));
          setUpdateWarrants({
            producerID: player.id,
            productID: productID,
            productQuality: productQuality,
            productAdQuality: productAdQuality,
            warrantAdded: false,
            warrantPrice: 0,
            warrantDesc: "",
            challengeAmount: 0,
            round: round.get("name"),
          });
        }

        console.log("2nd Use eff ELSE", capital);
      }
    }, [isCheckboxSelected]);



    const handleSubmit = () => {
      if (productAdQuality === "") {
        toast.error("Please select an advertisment quality for the product!");
      } else if (
        isCheckboxSelected == true && updateWarrants.warrantDesc === "") {
        toast.error("Select a warrant from the options!");
      } else if ( tempStock == 0){
        toast.error("You cannot submit without any stock!");
      
      }else {
        warrants = [...warrants, updateWarrants];
        // setUpdatedStock({
        //   ...updatedStock,
        //   productIdentifier: adjSelector(),
        // })
          stock = [...stock, updatedStock]
          player.set("warrants", warrants);
          player.set("stock", stock);
          player.stage.set("submit", true);
      }
    };

    function adjSelector() {
      /*
      This function returns a string that is a combination of the base producer name and an adjective
      */
      const adjPos = ["excellent", "premium", "superior", "legendary"];
      const adjNeg = ["expired", "weak", "obsolete", "cheap", "crappy"];
      const chosenAdj =
        productAdQuality === "high"
          ? adjPos[Math.floor(Math.random() * adjPos.length)]
          : adjNeg[Math.floor(Math.random() * adjNeg.length)];
      return `${brandName} ${productAdName} ${chosenAdj}'s ${category}`;
    }

    const decrementQuantity = () => {
      /*
      This function decrements the stock of the player by 1 and increments the capital by the product cost
      */
      if (tempStock >= iniStock) {
        setUpdatedStock({
          ...updatedStock,
          producerID: player.id,
          productID: productID,
          productIdentifier: adjSelector(),
          productQuality: productQuality,
          productAdQuality: productAdQuality,
          productCost: productCost,
          productPrice: productPrice,
          productAdImage: productAdImage,
          value: value,
          initialStock: tempStock -1,
          remainingStock: tempStock - 1,
        });
        setTempStock(tempStock - 1);
        setCapital(Number(capital) + Number(productCost));
      }
      console.log("Updated Stock: ", updatedStock)
    };

    const incrementQuantity = () => {
      /*
      This function increments the stock of the player by 1 and decrements the capital by the product cost
      */
      if (capital - productCost >= 0) {
        console.log("Updated Stock: ", updatedStock)
        setUpdatedStock({
          
          ...updatedStock,
          producerID: player.id,
          productID: productID,
          productIdentifier: adjSelector(),
          productQuality: productQuality,
          productAdQuality: productAdQuality,
          productCost: productCost,
          productPrice: productPrice,
          productAdImage: productAdImage,
          value: value,
          initialStock: updatedStock.remainingStock + 1,
          remainingStock: updatedStock.remainingStock + 1,
        });
        setTempStock(tempStock + 1);
        setCapital(Number(capital) - Number(productCost));
        console.log(updatedStock)
      }
    };


    // const onWarrantSelection = (e, multiplier, description) => {
    //   if (warrantAdded) {
    //     player.round.set("warrantDesc", description);
    //     player.round.set("warrantPrice", profit * multiplier); // Warrant price calculation
    //     setIsSelected(description);
    //     setSelectedWarrant(description);
    //     setMultiplier(multiplier);
    //   }
    // };

    // const onWarrantDeselection = (description) => {
    //   // setCapital(capital + player.round.get("warrantPrice"))
    //   player.round.set("warrantDesc", "");
    //   player.round.set("warrantPrice", 0);
    //   setIsSelected("");
    //   setSelectedWarrant(null);
    //   console.log("Warrant deselected");
    //   setMultiplier(null);
    // };
    // const removeWarrants = (warrantAdded) => {
    //   if (warrantAdded == false) {
    //     player.round.set("warrantDesc", "");
    //     player.round.set("warrantPrice", 0);
    //     setIsSelected("");
    //     console.log("Warrant removed");
    //   }
    // };
    function SellQualityOption({ quality, imgUrl, price, name, value }) {
      const qualityCapitalized = quality[0].toUpperCase() + quality.slice(1);
      const backgroundColor = quality === "low" ? "#FA6B84" : "#00CDBB";
      console.log("Product Ad Quality: ", productAdQuality)
      console.log("Quality: ", quality)
      console.log("Product Image: ", productAdImage)
      return (
        <div
          className="text-center flex flex-col justify-center items-center"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setProductPrice(price);
            setProductAdImage(imgUrl);
            setproductAdName(name);
            setProfit(price - productCost);
            setProductAdQuality(quality);
            setValue(value);
            updateStock(quality, imgUrl, price, name, value);
            updateWarrant();
          }}
        >
          <div
            className="option"
            style={{
              textAlign: "center",
              padding: "20px",
              backgroundColor: backgroundColor,
              color: "#FFF",
              border: "none",
              borderRadius: "15px",
              outline:
                quality === productAdQuality
                  ? `4px solid ${backgroundColor}`
                  : "none",
              outlineOffset: "3px",
              fontSize: "16px",
              marginRight: "10px",
              width: "370px",
            }}
          >
            <h2
              style={{
                fontWeight: "bold",
                fontFamily: "Avenir",
                fontSize: "24px",
              }}
            >
              Advertise as {qualityCapitalized + " "}
              Quality
            </h2>
            <p style={{ fontWeight: "lighter", fontFamily: "Avenir" }}>
              This will sell for ${price} in the market
            </p>
          </div>
          <img
            className="mb-6"
            style={{
              height: "375px",
              marginTop: "25px",
              borderRadius: "20px",
              filter: "drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.2))",
            }}
            src={imgUrl}
            alt={`${qualityCapitalized} quality toothpaste`}
          />
        </div>
      );
    }

    function WarrantSelector() {
      /*
      This function returns a component that allows the player to select a warrant for their advertisement
      */
      // const [isModalOpen, setIsModalOpen] = useState(false);
      // const [isCheckboxSelected, setIsCheckboxSelected] = useState(false);
      // const [selectedWarrant, setSelectedWarrant] = useState("");
      // const [isSelected, setIsSelected] = useState("");

      // // const productPrice = player.round.get('productPrice')
      // const productPrice = selectedIdx === 0 ? "5" : "10";
      // const profit = Math.abs(productPrice - productCost);
      // const [multiplier, setMultiplier] = useState(null);

      const selectedCardStyle = {
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        borderRadius: "6px",
        padding: "10px",
      };

      return (
        <div className="flex justify-center items-center">
          <div
            className="container cursor-pointer p-[20px] mb-[20px] w-1/2"
            style={{
              outline: isCheckboxSelected ? "3px solid #6688FF" : "1px solid #AAAAAA",
              outlineOffset: "3px",
              borderRadius: "15px",
            }}
          >
            <input
              className="rounded-full cursor-pointer"
              type="checkbox"
              id="addWarrant"
              checked={isCheckboxSelected}
              onClick={() => {
                if (tempStock <= 0 && capital <= profit * 5) {
                  toast.error("You do not have enough capital to add a warrant");
                }
                else if(productAdQuality === ""){
                  toast.error("Choose a quality to advertise first!");
                }
                else if(tempStock == 0){
                  toast.error("You cannot add a warrant without any stock!")
                }
                else{
                  setIsCheckboxSelected(!isCheckboxSelected);
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
                    className={`bg-blue-400 p-2 rounded-lg ${updateWarrants.warrantAdded ? "" : "bg-red-400"
                      }`}
                    disabled={!isCheckboxSelected}
                    onClick={() => setIsModalOpen(true)}
                  >
                    {updateWarrants.warrantAdded ? "Warrant Selected" : "Select Warrant"}
                  </button>
                )}
              </div>
              <p style={{ fontWeight: "normal" }}>
                This will cost you{" "}
                <b>{updateWarrants.warrantPrice == 0 ? "..." : updateWarrants.warrantPrice}</b>
                <br />
                Potential customers can see if you have chosen to warrant your
                advertisement or not, and a warrant can boost your credibility
                in the marketplace. If your ad is not found to be false, the
                money spent on your warrant will be fully refunded. However, if
                your warrant is challenged and your ad is found to be false, the
                money spent on the warrant will be lost to the challenger - and
                anyone in the market, including a competitor, may challenge this
                warrant.
              </p>
            </div>
          </div>

          <WarrantModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              // setCapital(capital - player.round.get("warrantPrice"));
            }}
            title="Warrant"
            children={
              <>
                {Array.isArray(productWarrants) && productWarrants.length > 0 && (
                  <div className="flex justify-center space-x-4">
                    {productWarrants.map((warrant, index) => {
                      return (
                        <div
                          style={
                            updateWarrants.warrantDesc === warrant.description
                              ? selectedCardStyle
                              : {}
                          }
                          className="flex flex-col items-center cursor-pointer select:border-2 border-black"
                          key={index}
                          onClick={(e) => {
                            if (updateWarrants.warrantDesc === warrant.description) {
                              setUpdateWarrants({
                                producerID: player.id,
                                productID: productID,
                                productQuality: productQuality,
                                productAdQuality: productAdQuality,
                                warrantAdded: false,
                                warrantPrice: 0,
                                warrantDesc: "",
                                challengeAmount: 0,
                                round: round.get("name"),
                              })
                              setCapital(Number(capital) + Number(warrant.multiplier * profit))
                              // onWarrantDeselection(warrant.description);
                            } else {
                              setCapital(Number(capital) + Number(updateWarrants.warrantPrice) - Number(warrant.multiplier * profit))
                              setUpdateWarrants({
                                ...updateWarrants,
                                warrantAdded: true,
                                warrantPrice: warrant.multiplier * profit,
                                warrantDesc: warrant.description,
                                challengeAmount: (warrant.multiplier * profit)
                              });
                              
                              // onWarrantSelection(
                              //   e,
                              //   warrant.multiplier,
                              //   warrant.description,
                              //   warrantAdded
                              // );
                            }
                          }}
                        >
                          <img
                            src={warrant.icon}
                            alt="icon"
                            className="mb-2 max-w-full h-auto rounded-lg"
                          />
                          <h1 className="font-bold text-center mb-4">
                            {warrant.description}
                          </h1>
                          <h1 className="font-semibold text-xl text-center">
                            <span style={{ color: "green" }}>
                              ${profit * warrant.multiplier}
                            </span>
                          </h1>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            }
          />
        </div>
      );
    }

    function InfoDisplay() {
      return (
        <div className="fixed left-[10px] top-[200px] w-[300px] bg-white p-[10px] shadow-md rounded-md z-[1000]">
          <b>Choices summary</b> <br />
          <span role="img" aria-label="capital">
            💵
          </span>
          Disposable capital for production: <b>${capital}</b>
          <br />
          <span role="img" aria-label="units">
            🏭
          </span>
          Produce {tempStock > 0 ? tempStock : "..."}{" "}
          <b>{productQuality}</b> quality units
          <br />
          <span role="img" aria-label="units">
            📢{" "}
          </span>
          Advertise as <b>{productAdQuality ? productAdQuality : "..."}</b>{" "}
          quality at a price of <b>${productPrice ? productPrice : "..."}</b>
          <br />
          <span role="img" aria-label="units">
            💲{" "}
          </span>
          Profit per unit sold: <b>${profit ? profit : "..."}</b>
          <br />
          <span role="img" aria-label="units">
            📢{" "}
          </span>
          Warrant your ad? <b>{updateWarrants.warrantAdded ? "Yes" : "No"}</b>
          <br />
          {/* Don't factor in warrant in total profit calculation, because it may be fully refunded */}
          <span role="img" aria-label="units">
            💰{" "}
          </span>
          Profit if you sell everything:{" "}
          <b>${profit * tempStock}</b>
          <PayoffMatrix role={"producer"} />
        </div>
      );
    }

    return (
      <div className="flex flex-col -top-6 justify-center items-center border-3 border-indigo-800 p-6 rounded-lg h-full shadow-md relative p-10 mt-32 w-10/12">
        <h1
          className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-yellow-200 border-2 border-teal-600 pl-2 pr-2 rounded-lg text-lg mb-4"
          style={{
            fontFamily: "'Archivo', sans-serif",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          <b>Choose how you want to Advertise</b> <br /> Note: Your goal is to
          maximize your profits.
        </h1>

        {<InfoDisplay />}

        <div className="flex justify-center gap-10 items-center">
          <SellQualityOption
            quality={low.productQuality}
            imgUrl={low.productImage}
            price={low.productPrice}
            name={low.productName}
            value={productQuality === "low" ? low.value : high.value}
          />
          <SellQualityOption
            quality={high.productQuality}
            imgUrl={high.productImage}
            price={high.productPrice}
            name={high.productName}
            value={productQuality === "low" ? low.value : high.value}
          />
        </div>
        <div className={"mx-10 mt-16 mb-16"}>
          <button
            // disabled={tempStock >= updatedStock.initialStock}
            className="text-red-500 border-solid border-2 rounded-full border-red-500 px-1.5 bg-white"
            onClick={() => {
              if (iniStock - tempStock == 0) {
                toast.error("You cannot reduce the stock any further!");
              }
              else if(updatedStock.initialStock == undefined){
                toast.error("Choose a quality to advertise first!");
              }
              else {
                decrementQuantity()
              }
            }}
          >-
          </button>
          <span style={{ marginLeft: "6px", marginRight: "6px" }}>
            {tempStock}
          </span>
          <button
            className="text-green-500 border-solid border-2 rounded-full border-green-500 px-1.5 bg-white"
            // disabled={capital - productCost < 0}
            onClick={() => {
              if (capital - productCost < 0) {
                toast.error("You do not have enough capital to produce more units!");
              } else if(updatedStock.initialStock == undefined){
                toast.error("Choose a quality to advertise first!");
                
              }
              else {
                incrementQuantity()
              }
            }}
          >
            +
          </button>
        </div>
        {
          marketType === "coasian-market" ? (
            <WarrantSelector />
          ) : null
        }
        <div className="flex justify-center items-center">
          <button
            onClick={handleSubmit}
            className="p-2 rounded-md border-transparent shadow-sm text-white bg-empirica-600 hover:bg-empirica-700"
          >
            Submit choices and go to market
          </button>
        </div>
      </div >
    );
  } else {
    const handleProceed = () => {
      player.stage.set("submit", true);
    };
    function ConsumerWaitingMessage() {
      return (
        <div className="text-center p-[20px] bg-white rounded-md shadow-md max-w-[500px] mx-[20px] my-auto">
          <h2>🕒 Waiting Room 🕒</h2>
          <p>While you wait: </p>
          <ul>
            <li>"What products will be available? 🤔🛍️"</li>
            <li>"Can you spot the best deals? 🕵️🔍"</li>
          </ul>

          <br />

          <p>
            For convenience, the table below represents how many points you
            would gain/lose for each possible combination of the quality you pay
            for and the quality you actually receive:
          </p>
          {/* TODO: Remove hardcoded costs and values */}
          <PayoffMatrix role={"consumer"} />

          <br />

          <p>
            Get ready to make smart choices and find the best products! 🧠🎯
          </p>
          <div className="text-base mt-[20px]">🛒🌟</div>
        </div>
      );
    }
    if (!role) {
      return <div>Loading... Unknown role</div>;
    }

    return (
      <div className="text-center p-[20px] bg-white rounded-md shadow-md max-w-[500px] mx-[20px] my-auto">
        <ConsumerWaitingMessage />
        <button
          onClick={handleProceed}
          className="hover: cursor-pointer rounded-md border-none bg-[#4CAF50] px-3 py-6 text-base text-white shadow-md transition-all ease-in-out hover:bg-[#45a049] hover:shadow-md hover:shadow-gray-400"
        >
          Proceed to next round
        </button>
      </div>
    );
  }
}