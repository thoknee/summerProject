/*

*/
import React, { useState, useEffect } from "react";
import { usePlayer, usePlayers, useRound } from "@empirica/core/player/classic/react";
import { toast } from "react-toastify";


const ConsumerProductCard = ({ producer, index, round, productSelections, wallet, setWallet, setBasket, basket, handleButtonClick, player }) => {
    const [stock, setStock] = useState(producer.get("stock"));
    const tempStock = stock.find((item) => item.round === round);
    const productID = tempStock.productID;
    const productQuality = tempStock.productQuality;
    const productAdQuality = tempStock.productAdQuality;
    const productPrice = tempStock.productPrice;
    const productIdentifier = tempStock.productIdentifier;
    const productAdImage = tempStock.productAdImage;
    const initialStock = tempStock.initialStock;
    const [remStock, setRemStock] = useState(tempStock.remainingStock);
    const warrants = producer.get("warrants");
    const tempWarrant = warrants.find((item) => item.round === round);
    const warrantAdded = tempWarrant.warrantAdded;
    const warrantPrice = tempWarrant.warrantPrice;
    const warrantDesc = tempWarrant.warrantDesc;
    const [quantity, setQuantity] = useState(0);

    const updateIncrementStock = () => {
        const trialStock = stock.map((item) => {
            return item.round === round
                ? {
                    ...item,
                    remainingStock: item.remainingStock + 1,
                    soldStock: item.soldStock - 1,
                }
                : item;
        });
        setStock(trialStock);
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
        setBasket(trialBasket);
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
        setStock(trialStock);
        setRemStock(remStock - 1);
        setQuantity(quantity + 1);
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
            }
            else {
                toast.error("You don't have enough money in your wallet or the stock is not available")
            }
        }
        else {
            toast.error("Please uncheck the checkbox to change the quantity")
        }
    }

    const getAllUniqueItems = (basket) => {
        const uniqueItems = [];
        const itemOccurrences = {};

        basket.forEach(item => {
            const roundNo = item.round;

            if (itemOccurrences[roundNo]) {
                itemOccurrences[roundNo]++;
            } else {
                itemOccurrences[roundNo] = 1;
            }

            if (itemOccurrences[roundNo] === 1) {
                uniqueItems.push(item);
            }
        });

        return uniqueItems;
    };


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
            <div className={"my-4"}>
                <button className="text-red-500 border border-red-500 rounded-full px-4 bg-white" onClick={decrementQuantity}>–</button>
                <span className="mx-1.5">{quantity}</span>
                <button className="text-green-500 border border-green-500 rounded-full px-3 bg-white" onClick={incrementQuantity}>+</button>
            </div>

            <button
                onClick={() => {
                    if (productSelections[index] === true) {
                        handleButtonClick(index)
                    }
                    else {
                        handleButtonClick(index)
                        producer.set("stock", stock)
                        // need to update for multiplayer TODO
                        player.set("basket", getAllUniqueItems(basket))
                    }
                }}
                className={`bg-${productSelections[index] ? "green-500" : "white"} text-black py-2 px-4 rounded-full border border-green-300 cursor-pointer shadow-md`}
            >
                {productSelections[index] ? "Added to Cart" : "Add to Cart"}
            </button>
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
    let [wallet, setWallet] = useState(player.get('role') == "consumer" && (player.get("wallet")));
    useEffect(() => {
        if (role === "consumer") {
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
                    let prodPrice = st.find((item) => {
                        if (item.round === round) {
                            return item.productPrice
                        }
                        return -1
                    })
                    return prodPrice.productPrice
                }

                const findvalue = (producer) => {
                    const st = producer.get("stock")
                    let prodvalue = st.find((item) => {
                        if (item.round === round) {
                            return item.value
                        }
                        return -1
                    })
                    return prodvalue.value
                }

                const putBasket = players
                    .filter((player) => player.get("role") === "producer")
                    .map((producer, index) => ({
                        producerID: producer.id,
                        productID: findproductID(producer),
                        productQuality: findproductQuality(producer),
                        productAdQuality: findproductAdQuality(producer),
                        productPrice: findproductPrice(producer),
                        value: findvalue(producer),
                        quantity: 0,
                        round: round,
                    }));
                setBasket((prevBasket) => [...prevBasket, ...putBasket]);
            }
            handleBasket()
        };
    }, [])

    const producerCount = players.filter((player) => player.get("role") === "producer").length;

    const [productSelections, setProductSelections] = useState(Array(producerCount).fill(false));

    const handleButtonClick = (index) => {
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
            toast.error("Please add your products to the cart before proceeding!");
        }
    };

    if (role === "consumer") {

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
            return players
                .filter((p) => p.get("role") === "producer")
                .map((producer, index) => {
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
                            handleButtonClick={handleButtonClick}
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
                <div>{renderProductFeed()}</div>
                <br />
                <br />
                <button onClick={handleProceed} className="bg-green-500 text-white py-3 px-6 text-lg rounded-md border-none cursor-pointer shadow-md transition-all duration-200 ease-in-out hover:bg-green-700">
                    Proceed to next stage
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
                    Proceed to next stage
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




