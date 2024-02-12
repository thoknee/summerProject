
import React, { useState, useEffect } from "react";
import { usePlayer, usePlayers, useRound } from "@empirica/core/player/classic/react";
import { toast } from "react-toastify";


const ConsumerProductCard = ({ producer, index, round, productSelections, wallet, setWallet, setBasket, basket, handleCheckboxChange, player }) => {
    const [stock, setStock] = useState(producer.get("stock"));
    // console.log(stock);
    const tempStock = stock.find((item) => {
        if (item.round === round) {
            return item
        }
        return 1
    })
    // const [updateStock, setUpdateStock] = useState(tempStock);
    // console.log(tempStock)
    const productID = tempStock.productID;
    const productQuality = tempStock.productQuality;
    const productAdQuality = tempStock.productAdQuality;
    const productPrice = tempStock.productPrice;
    const productIdentifier = tempStock.productIdentifier;
    const productAdImage = tempStock.productAdImage;
    const initialStock = tempStock.initialStock;
    const [remStock, setRemStock] = useState(tempStock.remainingStock);
    const warrants = producer.get("warrants");
    const tempWarrant = warrants.find((item) => {
        if (item.round === round) {
            return item
        }
    })
    // useEffect(() => {
    //     console.log("RemStock in ref", remStock)
    // }, [remStock])
    const warrant = tempWarrant;
    const warrantAdded = warrant.warrantAdded;
    const warrantPrice = warrant.warrantPrice;
    const warrantDesc = warrant.warrantDesc;
    const [quantity, setQuantity] = useState(0);
    // const tempBasket = basket.find((item) => {
    //     if (item.round === round && item.producerID === producer.id) {
    //         return item
    //     }
    // })
    // let [updatedBasket, setUpdatedBasket] = useState(tempBasket);
    // setUpdatedBasket({
    //     ...updatedBasket,
    //     producerID: producer.id,
    //     productID: productID,
    //     productQuality: productQuality,
    //     productAdQuality: productAdQuality,  
    //     productPrice: productPrice,
    // });

    const updateIncrementStock = () => {
        const trialStock = stock.map((item) => {
            return item.round === round
                ? {
                    ...item,
                    remainingStock: item.remainingStock + 1,
                    soldStock: item.soldStock - 1,
                    // You can add other attributes here if needed
                }
                : item;
        });
        // Set the updated stock array
        setStock(trialStock); // [{}]
        setRemStock(remStock + 1);
        setQuantity(quantity - 1);
    };

    const updateIncrementBasket = () => {
        const trialBasket = basket.map((item) => {
            return item.round === round && item.producerID === producer.id
                ? {
                    ...item,
                    productID: productID,
                    productQuality: productQuality,
                    productAdQuality: productAdQuality,
                    productPrice: productPrice,
                    quantity: item.quantity + 1,
                }
                : item;
        });
        // Set the updated basket array
        setBasket(trialBasket);
        console.log("basket in ", basket)
        // console.log(basket)
    }

    const updateDecrementBasket = () => {
        const trialBasket = basket.map((item) => {
            return item.round === round && item.producerID === producer.id
                ? {
                    ...item,
                    productID: productID,
                    productQuality: productQuality,
                    productAdQuality: productAdQuality,
                    productPrice: productPrice,
                    quantity: item.quantity - 1,
                }
                : item;
        });
        // Set the updated basket array
        setBasket(trialBasket);
    }

    const updateDecrementStock = () => {
        const trialStock = stock.map((item) => {
            return item.round === round
                ? {
                    ...item,
                    remainingStock: item.remainingStock - 1,
                    soldStock: item.soldStock + 1,
                }
                : item;
        });
        // Set the updated stock array
        setStock(trialStock); // [{}]
        setRemStock(remStock - 1);
        // console.log("RemStock", remStock);
        setQuantity(quantity + 1);
        // console.log("Quantity", quantity);
    };

    const decrementQuantity = () => {
        if (productSelections[index] === false) {
            if (quantity > 0 && initialStock > remStock) {
                setWallet(wallet + productPrice);
                updateIncrementStock();
                updateDecrementBasket();
            }
            else {
                toast.error("You cannot decrease the quantity further")
            }
        }
        else {
            toast.error("Please uncheck the checkbox to change the quantity")
        }
    }
    const incrementQuantity = () => {
        if (productSelections[index] === false) {
            if (remStock > 0 && productPrice <= wallet) {
                setWallet(wallet - productPrice);
                updateDecrementStock();
                updateIncrementBasket();
                // console.log("RemStock", remStock);
                // console.log("Quantity", quantity);
            }
            else {
                toast.error("You don't have enough money in your wallet or the stock is not available")
            }
        }
        else {
            toast.error("Please uncheck the checkbox to change the quantity")
        }
    }
    // const handlePurchase = (wallet, producerID, stock, quantity) => {

    //     console.log("Consumer attempts to buy");
    //     // Update wallet
    //     player.set("wallet", wallet);
    //     // Update basket for the consumer
    //     let basket = player.round.get("basket") || {};
    //     basket[producerID] = quantity;
    //     console.log("player basket updates", player.round.get("basket"));
    //     //console.log("player wallet updates", player.round.get("wallet"));
    //     player.round.set("basket", basket);
    //     const prod = players.find((item) => item.id === producerID);
    //     if (prod.round.get("productQuality") == "low") {
    //         prod.round.set("stocklow", stock);
    //     }
    //     else {
    //         prod.round.set("stockhigh", stock);
    //     }

    // };
    return (
        <div className="product-card border border-gray-300 shadow-md p-8 rounded-lg w-[325px] text-center bg-white mx-auto relative overflow-hidden">
            {warrantAdded ? (
                <div
                    className="warrant-banner bg-blue-500 transform rotate-30 w-[200px] absolute right-0 mr-neg-45 -mt-[10px]"
                >
                    <b className="text-white" style={{ fontFamily: "Avenir" }}>WARRANTED</b>
                </div>
            ) : (
                <></>
            )}
            <h3>{`Ad # ${index + 1}`}</h3>
            <h4>Seller: {producer.id}</h4>
            <h3>{productIdentifier}</h3>
            <img
                className="max-w-full max-h-[20rem] h-auto w-auto block mx-auto mb-10"
                src={productAdImage}
                alt={`Product ${index + 1}`}
            />
            <p>Quality: {productAdQuality}</p>
            <p>Price: ${productPrice}</p>
            {warrantAdded ? <><p>Warrant Description: {warrantDesc}</p><p>Warranted for: ${warrantPrice}</p></> : <></>}
            <p>
                In stock: <b>{remStock}</b>
            </p><br />
            <p>
                The amount to purchase:</p>
            <div className={"mt-4"}>
                <button className="text-red-500 border border-red-500 rounded-full px-4 bg-white" onClick={decrementQuantity}>–</button>
                <span className="mx-1.5">{quantity}</span>
                <button className="text-green-500 border border-green-500 rounded-full px-3 bg-white" onClick={incrementQuantity}>+</button>
            </div>

            <input
                type="checkbox"
                checked={productSelections[index]}
                onChange={() => {
                    if (productSelections[index] === true) {
                        handleCheckboxChange(index)
                    }
                    else {
                        handleCheckboxChange(index)
                        producer.set("stock", stock)
                        player.set("basket", basket)
                        console.log("basket in check", player.get("basket"))
                        console.log("stock in check", producer.get("stock"))
                    }
                }}
            />
            {/*<p>
            Challenge status: <b>{challengeStatus}</b>
          </p>
           <button
           className="bg-blue-500 text-white py-2 px-4 text-sm rounded-md border-none cursor-pointer shadow-md transition-all duration-200 ease-in-out mt-2 mb-2 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
            onClick={() => {
              handleChallenge(challengeStatus, producer.id);
              console.log(challengeStatus : ${producer.round.get("challengeStatus")});
              setChallengeStatus(producer.round.get("challengeStatus"));
            }}
            disabled={!warrantAdded}
          >
            Challenge
          </button> */}
        </div>
    );
}



export function ChoiceStage() {
    const player = usePlayer();
    const players = usePlayers();
    const role = player.get("role");
    const roundHook = useRound()
    const round = roundHook.get("name");

    let [basket, setBasket] = useState(player.get('role') == "consumer" && (player.get("basket") || []))

    useEffect(() => {
        const handleBasket = () => {
            const findproductID = (producer) => {
                const st = producer.get("stock")
                let prodID = st.find((item) => {
                    if (item.round === round) {
                        return item.productID
                    }
                    return -1
                })
                return prodID.productID
            }
            const findproductQuality = (producer) => {
                const st = producer.get("stock")
                let prodQual = st.find((item) => {
                    if (item.round === round) {
                        return item.productQuality
                    }
                    return -1
                })
                return prodQual.productQuality
            }
            const findproductAdQuality = (producer) => {
                const st = producer.get("stock")

                let prodAdQual = st.find((item) => {
                    if (item.round === round) {
                        return item.productAdQuality
                    }
                    return -1
                })
                return prodAdQual.productAdQuality
            }
            const findproductPrice = (producer) => {
                const st = producer.get("stock")
                console.log("stock in findprod", st)
                let prodPrice = st.find((item) => {
                    if (item.round === round) {
                        // console.log("item in:",item.productPrice)
                        return item.productPrice
                    }
                    return -1
                })
                return prodPrice.productPrice
            }
            
            const putBasket = players
                .filter((player) => player.get("role") === "producer")
                .map((producer, index) => ({
                    producerID: producer.id,
                    productID: findproductID(producer),
                    productQuality: findproductQuality(producer),
                    productAdQuality: findproductAdQuality(producer),
                    productPrice: findproductPrice(producer),
                    quantity: 0,
                    round: round,
                }));
            if (role === "consumer") {
                setBasket((prevBasket) => [...prevBasket, ...putBasket]);
                console.log("basket", basket);

            }
            // player.set("basket", basket);
        };
        handleBasket()
    }, [])
    // Check Box state

    const producerCount = players.filter((player) => player.get("role") === "producer").length;

    const [productSelections, setProductSelections] = useState(Array(producerCount).fill(false));

    const handleCheckboxChange = (index) => {
        const newSelections = [...productSelections];
        newSelections[index] = !newSelections[index];
        setProductSelections(newSelections);
    };

    const allProductsSelected = productSelections.every((isSelected) => isSelected);

    const handleProceed = () => {
        if (allProductsSelected) {
            player.set("wallet", wallet);
            player.stage.set("submit", true);
        } else {
            toast.error("Please select all checboxes for the products before proceeding.");
        }
    };

    // [
    //   {productId: ""}, {productId: ""}, {productId: ""}
    // ]

    if (role === "consumer") {


        let [wallet, setWallet] = useState(player.get("wallet"));
        // let [basket, setBasket] = useState(player.get("basket") || [])





        // const handleProceed = () => {
        //     // if(role === "consumer" || role === "producer")
        //     player.set("basket", basket);
        //     player.set("wallet", wallet);
        //     player.stage.set("submit", true);
        // };



        const WalletDisplay = () => {
            return (
                <div className="fixed top-1/4 left-[20px] bg-white p-4 shadow-md rounded-lg z-10">
                    <span role="img" aria-label="wallet">
                        💰
                    </span>
                    Wallet: ${wallet.toFixed(2)}
                </div>
            );
        }

        const renderProductFeed = () => {
            // handleBasket();
            // console.log("basket", basket);
            return players
                .filter((p) => p.get("role") === "producer")
                .map((producer, index) => {
                    // 
                    return (
                        <ConsumerProductCard
                            key={index}
                            producer={producer}
                            index={index}
                            round={round}
                            productSelections={productSelections}
                            wallet={wallet}
                            setWallet={setWallet}
                            basket={basket}
                            setBasket={setBasket}
                            handleCheckboxChange={handleCheckboxChange}
                            player={player}
                        />
                    )
                });
        };

        return (
            <div>
                <br />
                <h2 className="font-bold">Advertisements</h2>
                <h3>You can only buy if you have enough money in your wallet.</h3>
                <WalletDisplay />
                {/* <button onClick={renderProductFeed}>Are you ready?</button> */}
                <div>{renderProductFeed()}</div>
                <br />
                <br />
                <button onClick={handleProceed} className="bg-green-500 text-white py-3 px-6 text-lg rounded-md border-none cursor-pointer shadow-md transition-all duration-200 ease-in-out hover:bg-green-700">
                    Proceed to next round
                </button>
                <br />
                <br />
                <br />
                <br />
            </div>
        );

    }

    else if (role === "producer") {
        const handleProceed = () => {
            player.stage.set("submit", true);
        };
        // let unitsSold = player.round.get("unitsSold");
        function ProducerWaitingMessage() {
            /* 
            This fuction will be used to display the waiting message for the producer
            */
            return (
                <div className="text-center p-4 bg-gray-200 rounded-lg shadow-md max-w-[500px] mx-auto my-4">
                    <h2>🕒 Waiting Room 🕒</h2>
                    <p>While you wait: </p>
                    <ul>
                        <li>"How many will buy your product? 🤔🛒"</li>
                        <li>"What moves are your competitors making? 🚀🕵‍♂"</li>
                    </ul>
                    <p>Keep an eye on the market trends and plan your next steps! 💡📈</p>
                    <div className="text-2xl mt-5">🏭🌟</div>
                </div>
            );
        }
        return (
            <div className="text-center p-4 bg-gray-200 rounded-lg shadow-md max-w-[500px] mx-auto my-4">
                <ProducerWaitingMessage />
                <button onClick={handleProceed} className="bg-green-500 text-white py-3 px-6 text-lg rounded-md border-none cursor-pointer shadow-md transition-all duration-200 ease-in-out hover:bg-green-700">
                    Proceed to next round
                </button>
            </div>
        );
    }

    else if (!role) {
        return <div>Loading...</div>;
    }

    else {
        return <div>Unknown role</div>;
    }
}





