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
        <div className="text-lg font-base">
            <p><b>Producer:</b> {producer.id}</p>
            <p><b>Units Bought:</b> {quantity}</p>
            <p><b>Advertised quality was:</b> {productAdQuality} </p>
            <p><b>Real product quality was:</b> {productQuality} {emoji}</p>
            <p><b>Remaining capital in wallet:</b> {wallet} </p>
            <br />
            {warrantAdded && quantity > 0 ? (
                <>
                    <p><b>Are you willing to challenge the producer's warrant?</b></p>
                    <p><b>Warrant: {warrantDesc}</b></p>
                    <p><b>Challenge Amount: {challengeAmount}</b></p>
                    <button
                        className="bg-blue-600 text-white py-2 px-4 text-sm rounded-md border-none cursor-pointer shadow-md transition-all duration-200 ease-in-out hover:bg-blue-700 hover:shadow-md m-2.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
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
                        className={`bg-${claimSelections[index] ? "green-500" : "white"} text-black py-2 px-4 rounded-full`}
                    >
                        {claimSelections[index] ? "Confirmed!" : "Confirm?"}
                    </button>
                </>
            ) : warrantAdded && quantity == 0 ? (
                <p>Since you didnt buy any units for this product, you cannot challenge it!.</p>
            ) : (
                <>
                    <p>Since this product is not warranted, you are not able to challenge it</p>
                    <button
                        className={`bg-${claimSelections[index] ? "green-500" : "white"} text-black py-2 px-4 rounded-full`}
                        onClick={() => funcHandle()}
                    >{claimSelections[index] == true ? <>Reviewed!</> : <>Reviewed the Summary?</>}</button>
                </>
            )}<br />
            <p><span role="img" aria-label="trophy">🏆</span> Your current score is your remaining wallet + utility score = (<b>${player.get("score")}</b>).</p>
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
            <div className="bg-gray-300 p-4 rounded-lg shadow-md mb-8 flex justify-center items-center flex flex-col text-center">
                <h2 className="text-xl font-bold py-6"><b>🛒 Your Consumer Summary</b></h2>
                <div className={clicked ? `hidden` : `bg-gray-200 shadow-md text-center mx-auto my-auto w-full h-full p-8`}>
                    <h2>Get ready to review your purchase summary for the products you've bought this round. Take a moment to check your order details. If you have any concerns or need to challenge a warrant on any product, click below to get started!.</h2>
                    <button
                        className="bg-blue-500 text-white py-3 px-6 text-lg rounded-md border-none cursor-pointer shadow-md transition-all duration-200 ease-in-out hover:bg-blue-700 hover:shadow-md disabled:opacity-100 disabled:cursor-not-allowed"
                        onClick={() => {
                            handleClaims()
                            handleChallenges()
                            setClicked(!clicked)
                        }}
                        disabled={clicked}
                    >
                        Are You Ready!
                    </button>
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
                <div className="bg-gray-300 p-4 rounded-lg shadow-md mb-8">

                    <h3><b>🌟 Producer Summary 🌟</b></h3>
                    <p><span role="img" aria-label="factory">🏭</span> You produced a <b>{productQuality}</b> quality product and advertised it as <b>{productAdQuality}</b> quality.</p>
                    <p><span role="img" aria-label="shopping-cart">🛒</span> Consumers bought <b>{soldStock}</b> units of your product at <b>${productPrice}</b> each.</p>
                    <p><span role="img" aria-label="money-bag">💰</span> This resulted in a total profit of: <b>${profit.toFixed(2)}</b>.</p>

                    <br />
                    <p><span role="img" aria-label="trophy">🏆</span> Your score this round is your profits (<b>${profit}</b>).</p>
                    <br />
                    <p>Your remaining capital for this round is : ${capital}</p>
                </div>
            );
        };
        return (
            <div className="bg-gray-300 p-4 rounded-lg shadow-md mb-8">
                <br />
                {renderProducerFeedback()}
                <br />
                <button className="bg-green-500 text-white py-3 px-6 text-lg rounded-md border-none cursor-pointer shadow-md transition-all duration-200 ease-in-out hover:bg-green-700 hover:shadow-md" onClick={handleProceed}>Proceed to next stage</button>
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