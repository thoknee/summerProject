/*
    This file contains the feedback stage for the consumer and producer roles.
    ConsumerFeedbackCard is used to display the feedback to the consumer.
    ProducerFeedbackCard is used to display the feedback to the producer.
    handleButtonClick is used to handle the button click.
    handleClaims is used to handle the claims.
    handleChallenges is used to handle the challenges.
    getQualityMatchEmoji is used to get the quality match emoji.
    player.get("role") is used to get the role of the player.
    player.get("wallet") is used to get the wallet of the consumer.
    player.get("challenges") is used to get the challenges of the consumer.
    player.get("claims") is used to get the claims of the producer.
    player.get("score") is used to get the score of the player.
    player.round.set("warrantPrice", warrantPrice) is used to set the warrant price of the consumer.
    player.round.set("warrantAdded", warrantAdded) is used to set the warrant added of the consumer.
    player.round.set("challengeAmount", challengeAmount) is used to set the challenge amount of the consumer.
    player.set("wallet", wallet) is used to set the wallet of the consumer.
    player.set("challenges", challenges) is used to set the challenges of the consumer.
    player.set("claims", claims) is used to set the claims of the producer.
    player.set("basket", basket) is used to set the basket of the consumer.
    player.stage.set("submit", true) is used to submit the stage and move to the next stage.
*/

import React, { useState } from "react";
import { usePlayer, usePlayers, useRound } from "@empirica/core/player/classic/react";
import { toast } from "react-toastify";

// ConsumerFeedbackCard is used to display the feedback to the consumer.
function ConsumerFeedbackCard({ producer, player, index, basket, round, wallet, setWallet, challenges, setChallenges, setClaims, claims, claimSelections, handleButtonClick }) {
    const productAdQuality = basket.find((item) => item.producerID === producer.id && item.round === round).productAdQuality;
    const productQuality = basket.find((item) => item.producerID === producer.id && item.round === round).productQuality;
    const quantity = basket.find((item) => item.producerID === producer.id && item.round === round).quantity;
    const warrants = producer.get("warrants")
    const warrantAdded = warrants.find((item) => item.round === round).warrantAdded;
    const warrantPrice = warrants.find((item) => item.round === round).warrantPrice;
    const warrantDesc = warrants.find((item) => item.round === round).warrantDesc;
    const challengeAmount = warrants.find((item) => item.round === round).challengeAmount;
    const tempChallenge = challenges.find((item) => item.round === round && item.producerID === producer.id);
    const [challengeStatus, setChallengeStatus] = useState(tempChallenge.status);

    const changeChallenge = () => {
        const trialChallenge = challenges.map((item) => {
            return item.round === round && item.producerID === producer.id
                ? {
                    ...item,
                    status: !item.status,
                    challenge: productAdQuality === productQuality ? false : true
                }
                : item;
        });
        setChallenges(trialChallenge);
        setChallengeStatus(!challengeStatus)
    };

    const changeClaims = () => {
        const trialClaims = claims.map((item) => {
            return item.round === round && item.consumerID === player.id
                ? {
                    ...item,
                    status: !item.status,
                    claim: productAdQuality === productQuality ? true : false
                }
                : item;
        });
        setClaims(trialClaims);
    };


    const getQualityMatchEmoji = (productAdQuality, productQuality) => {
        // This function returns an emoji based on the match between advertised and actual quality
        if (productAdQuality === productQuality) {
            return '👍'; // Thumbs up for a match
        } else if (productAdQuality === "high" && productQuality === "low") {
            return '😠'; // Angry for high advertised but low actual quality
        } else if (productAdQuality === "low" && productQuality === "high") {
            return '🤔'; // Thinking for low advertised but high actual quality
        } else {
            return '❓'; // Question mark for any other case
        }
    };
    // This function handles the button click when there is no warrant
    const funcHandle = () => {
        handleButtonClick(index)
        producer.set("claims", claims)
        player.round.set("warrantPrice", warrantPrice)
        player.round.set("warrantAdded", warrantAdded)
        player.round.set("challengeAmount", challengeAmount)
    }
    const emoji = getQualityMatchEmoji(productAdQuality, productQuality);
    return (
        <div className="text-lg font-base mt-2">
            <div style={{ fontFamily: "Archivo" }}>
            <p><b className="text-gray-700">👨‍💼 Producer: </b>  {producer.id}</p>
            <p><b className="text-gray-700">📦 Units Bought: </b>  {quantity}</p>
            <p><b className="text-gray-700">🛃 Advertised Quality was:</b> {productAdQuality.charAt(0).toUpperCase() + productAdQuality.slice(1)} </p>
            <p><b className="text-gray-700">✅ Real Product Quality was:</b> {productQuality.charAt(0).toUpperCase() + productQuality.slice(1)} {emoji}</p>
            <p><b className="text-gray-700">💰 Remaining Capital in Wallet:</b> {wallet} </p>
            </div>
            <br/>
            <div className="px-4">
                <div className="relative max-w-[600px] mb-8">
                <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-blue-500 rounded-lg"></span>
                    <div className="relative h-full p-4 bg-white border-2 border-blue-500 rounded-lg">
                    {warrantAdded && quantity > 0 ? (
                        <>
                            <div className="text-xl mb-3" style={{ fontFamily: "Archivo" }}>
                                <p><b>Are you willing to challenge the producer's warrant?</b></p>
                            </div>
                            <p className="text-base"><b className="text-gray-800">Warrant:</b> {warrantDesc}</p>
                            <p className="text-base mb-6"><b className="text-gray-800">Challenge Amount:</b> {challengeAmount}</p>
                            <button
                                className="bg-blue-600 text-white py-2.5 px-5 text-base rounded-md border-none cursor-pointer shadow-md transition-all duration-200 ease-in-out hover:bg-blue-700 hover:shadow-md m-2.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                                onClick={() => {
                                    if (claimSelections[index] == true) {
                                        toast.error("Please unconfirm your decision first!")
                                    }
                                    else if (wallet >= parseInt(challengeAmount) && challengeStatus == false) {
                                        setWallet(wallet - challengeAmount)
                                        changeChallenge()
                                        changeClaims()
                                    }
                                    else if (challengeStatus == true) {
                                        setWallet(wallet + challengeAmount)
                                        changeChallenge()
                                        changeClaims()
                                    }
                                    else {
                                        toast.error("Not enough money in your wallet to challenge")
                                    }
                                }}
                            >
                                {challengeStatus == true ? <>Challenged!</> : <>Challenge?</>}
                            </button>
                            <button
                                onClick={() => {
                                    if (claimSelections[index] == true) {
                                        handleButtonClick(index)
                                    }
                                    else {
                                        handleButtonClick(index)
                                        producer.set("claims", claims)
                                        player.set("challenges", challenges)
                                        player.round.set("warrantPrice", warrantPrice)
                                        player.round.set("warrantAdded", warrantAdded)
                                        player.round.set("challengeAmount", challengeAmount)
                                        player.set("wallet", wallet)
                                    }
                                }}
                                className={`bg-${claimSelections[index] ? "green-500" : "teal-100"} text-black py-2 px-4 rounded-full`}
                            >
                                {claimSelections[index] ? "Confirmed!" : "Confirm?"}
                            </button>
                        </>
                    ) : warrantAdded && quantity == 0 ? (
                        <p>Since you didnt buy any units for this product, you cannot challenge it!.</p>
                    ) : (
                        <>
                            <p className="mb-5">Since this product is <strong>not</strong> warranted, you are not able to challenge it</p>
                            <button
                                className={`bg-${claimSelections[index] ? "green-500" : "bg-white"} text-black py-2 px-4 rounded-full shadow-md mb-2`}
                                onClick={() => funcHandle()}
                            >{claimSelections[index] == true ? <>Reviewed!</> : <>Reviewed the Summary?</>}</button>
                        </>
                    )}<br />    
                    </div>
                </div>
            </div>
            <p className="mb-6"><span role="img" aria-label="trophy">🏆</span> Your current score is your remaining wallet + utility score = (<b>${player.get("score")}</b>)</p>
        </div>
    );
}


export function FeedbackStage() {
    const player = usePlayer();
    const players = usePlayers();
    const role = player.get("role");
    const roundHook = useRound();
    const round = roundHook.get("name");
    const producerPlayers = players.filter((p) => p.get("role") === "producer");

    let [challenges, setChallenges] = useState(player.get("role") == "consumer" && (player.get("challenges") || []))
    let [claims, setClaims] = useState([])
    const producerCount = players.filter((player) => player.get("role") === "producer").length;
    const [claimSelections, setClaimSelections] = useState(Array(producerCount).fill(false));

    const handleButtonClick = (index) => {
        const newSelections = [...claimSelections];
        newSelections[index] = !newSelections[index];
        setClaimSelections(newSelections);
    };

    const allClaimsSelected = claimSelections.every((isSelected) => isSelected);
    const handleClaims = () => {
        const putClaims = players
            .filter((player) => player.get("role") === "consumer")
            .map((consumer, index) => ({
                consumerID: consumer.id,
                status: false,
                claim: false,
                round: round
            }))
        setClaims((prevClaims) => {
            if (Array.isArray(prevClaims)) {
                return [...prevClaims, ...putClaims];
            } else {
                return [...putClaims];
            }
        });
    }

    const handleChallenges = () => {
        const putChallenges = players
            .filter((player) => player.get("role") === "producer")
            .map((producer, index) => ({
                producerID: producer.id,
                status: false,
                challenge: false,
                round: round,
            }));
        setChallenges((prevChallenges) => {
            if (Array.isArray(prevChallenges)) {
                return [...prevChallenges, ...putChallenges];
            } else {
                return [...putChallenges];
            }
        });
    }

    if (role === "consumer") {
        const [wallet, setWallet] = useState(player.get("wallet"));
        const [clicked, setClicked] = useState(false);


        const handleSubmit = (basket) => {
            if (allClaimsSelected) {
                player.set("basket", basket);
                player.set("challenges", challenges);
                player.stage.set("submit", true);
            }
            else {
                toast.error("Review the summary or confirm your challenge to make more profits in the next round!");
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

        const basket = getAllUniqueItems(player.get("basket"));


        return (
            <div className="bg-gradient-to-r from-slate-100 to-blue-50 mt-10 p-4 rounded-lg shadow-md mb-8 flex justify-center items-center flex flex-col text-center max-w-[700px]">
                <h2 className="text-2xl font-bold mt-2 mb-6"><b>🛒 Your Consumer Summary 🛒</b></h2>
                <div className={clicked ? `hidden` : `mb-8 bg-white shadow-md text-center mx-auto my-auto w-full h-full p-6 rounded-lg max-w-[550px] border-8 border-gray-100`}>
                    <h2>Get ready to review your purchase summary for the products you've bought this round. 
                        Take a moment to check your order details! 🛍️</h2> <br/>
                        
                        <h2>If you have any concerns or need to challenge a warrant on any product, click below to get started! 🛒</h2>

                        <div className="relative">
                            <span className="absolute right-40 z-10 mt-[-8px] mr-[-8px]">
                                <span className="relative flex h-4 w-4">
                                <span className="top-9 animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                <span className="relative top-9 inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                                </span>
                            </span>
                        <button
                            className="mt-8 mb-3 bg-blue-500 text-white py-3 px-6 text-lg rounded-md border-none cursor-pointer shadow-md transition-all duration-200 ease-in-out hover:bg-blue-700 hover:shadow-md disabled:opacity-100 disabled:cursor-not-allowed relative"
                            onClick={() => {
                            handleClaims();
                            handleChallenges();
                            setClicked(!clicked);
                        }}
                        disabled={clicked}
                        >
                            Are You Ready!
                    </button>
                </div>


                </div>

                {clicked && players.filter((p) => p.get("role") === "producer").map((producer, index) => {
                    return <ConsumerFeedbackCard
                        key={index}
                        producer={producer}
                        player={player}
                        index={index}
                        basket={basket}
                        round={round}
                        wallet={wallet}
                        setWallet={setWallet}
                        challenges={challenges}
                        setChallenges={setChallenges}
                        claims={claims}
                        setClaims={setClaims}
                        handleButtonClick={handleButtonClick}
                        claimSelections={claimSelections}
                    />
                })}

                <br />
                {allClaimsSelected && (
                    <button
                        className="bg-green-500 text-white py-3 px-6 text-lg rounded-md border-none cursor-pointer shadow-md transition-all duration-200 ease-in-out hover:bg-green-700 hover:shadow-md"
                        onClick={() => handleSubmit(basket)}
                    >
                        Proceed to next stage
                    </button>
                )}

            </div>
        );
    }
    else if (!role) {
        return <div>Loading...</div>;
    }
    else if (role === "producer") {
        const handleProceed = () => {
            player.stage.set("submit", true);
        };

        const renderProducerFeedback = () => {
            const productQuality = player.round.get("productQuality");
            const stock = player.get("stock")
            const productAdQuality = stock.find((item) => item.round === round).productAdQuality;
            const productPrice = stock.find((item) => item.round === round).productPrice;
            const productCost = player.round.get("productCost")
            const capital = player.get("capital")
            const soldStock = stock.find((item) => item.round === round).soldStock;
            const profit = soldStock * (productPrice - productCost);

            return (
                // <div className="bg-gray-300 p-4 rounded-lg shadow-md mb-8">
                <div className="text-center p-4 bg-white rounded-lg shadow-md max-w-[600px] mx-auto border-8 border-gray-100">
                    <h2 className="text-2xl mb-6 font-semibold flex items-center justify-center">
                        <img src="https://i.pinimg.com/originals/8f/9f/76/8f9f76391315ee0b33d9b17981ee8ce0.gif" alt="timer" className="w-6 h-6 mr-2" />
                        Producer Summary
                        <img src="https://i.pinimg.com/originals/8f/9f/76/8f9f76391315ee0b33d9b17981ee8ce0.gif" alt="timer" className="w-6 h-6 ml-2" />
                    </h2>
                    <hr class="border-t border-gray-300 my-4"/>
                    <div className="mt-6">
                    {/* <h3><b>🌟 Producer Summary 🌟</b></h3> */}
                        <p><span role="img" aria-label="factory">🏭</span> You produced a <b>{productQuality.charAt(0).toUpperCase() + productQuality.slice(1)}</b> quality product and advertised it as <b>{productQuality.charAt(0).toUpperCase() + productQuality.slice(1)}</b> quality!</p>
                        <p><span role="img" aria-label="shopping-cart">🛒</span> Consumers bought <b>{soldStock}</b> unit(s) of your product at <b>${productPrice}</b> each!</p>
                        <p><span role="img" aria-label="money-bag">💰</span> This resulted in a total profit of: <b>${profit.toFixed(2)}</b></p>
                        <br />
                        <p><span role="img" aria-label="trophy">🏆</span> Your score this round is your profits (<b>${profit}</b>).</p>
                        <br />
                        <p className="text-lg" style={{ fontFamily: "'Archivo', sans-serif" }}>Your remaining capital for this round is : <b>${capital}</b></p>
                    </div>
                </div>
            );
        };
        return (
            // <div className="bg-gray-300 p-4 rounded-lg shadow-md mb-8">
            <div className="text-center mt-8 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg shadow-md max-w-[700px] mx-auto my-4">
                <br />
                {renderProducerFeedback()}
                <br />
                <button className="mb-4 mt-1 bg-green-500 text-white py-3 px-6 text-lg rounded-md border-none cursor-pointer shadow-md transition-all duration-200 ease-in-out hover:bg-green-700 hover:shadow-md" onClick={handleProceed}>Proceed to next stage</button>
            </div>
        );

    }

    else {
        return (
            <div>
                <h1>Feedback Stage</h1>
            </div>
        );
    }


};