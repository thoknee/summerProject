import React, { useState, useEffect } from "react";
import { usePlayer, usePlayers, useRound } from "@empirica/core/player/classic/react";
import { toast } from "react-toastify";

function ConsumerFeedbackCard({ producer, player, index, basket, round, wallet, setWallet, challenges, setChallenges, setClaims, claims, claimSelections, handleButtonClick }) {
    console.log("basket in main func", basket)
    const productAdQuality = basket.find((item) => item.producerID === producer.id && item.round === round).productAdQuality;
    const productQuality = basket.find((item) => item.producerID === producer.id && item.round === round).productQuality;
    const quantity = basket.find((item) => item.producerID === producer.id && item.round === round).quantity;
    // const stock = producer.get("stock")
    console.log("productAdQuality", productAdQuality)
    console.log("productQuality", productQuality)


    const warrants = producer.get("warrants")
    const warrantAdded = warrants.find((item) => item.round === round).warrantAdded;
    // const warrantPrice = warrants.find((item) => item.round === round).warrantPrice;
    const warrantDesc = warrants.find((item) => item.round === round).warrantDesc;
    const challengeAmount = warrants.find((item) => item.round === round).challengeAmount;
    const tempChallenge = challenges.find((item) => item.round === round && item.producerID === producer.id);
    console.log("warrantDesc", warrantDesc)
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
        // Set the updated stock array
        setChallenges(trialChallenge); // [{}]
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
        // Set the updated stock array
        setClaims(trialClaims); // [{}]
        // setChallengeStatus(!challengeStatus)
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


    const emoji = getQualityMatchEmoji(productAdQuality, productQuality);
    return (
        <div>
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
                    <p><b>Your choice:</b> {challengeStatus}</p>
                    <button
                        className="bg-blue-600 text-white py-2 px-4 text-sm rounded-md border-none cursor-pointer shadow-md transition-all duration-200 ease-in-out hover:bg-blue-700 hover:shadow-md m-2.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                        onClick={() => {
                            if (wallet >= parseInt(challengeAmount) && challengeStatus == false) {
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
                                alert("Not enough money in your wallet to challenge")
                            }
                        }}
                    // disabled={!warrantAdded}
                    >
                        Challenge
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
                                console.log("claims in submit", claims)
                                console.log("challenges in submit", challenges)
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
                <p>Since this product is not warranted, you are not able to challenge it</p>
            )}<br />
            {/* <br /><p><span role="img" aria-label="trophy">🏆</span> Your current score is your remaining wallet (<b>${wallet}</b>) + utility score(<b>${(value_use - productPrice) * quantity}</b>) = (<b>${wallet + (value_use - productPrice) * quantity}</b>).</p> */}
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
    // const getClaims = players.find((p) => p.role === "producer")
    const producerPlayers = players.filter((p) => p.get("role") === "producer");
    console.log("producerPlayers", producerPlayers)

    let [challenges, setChallenges] = useState(player.get("role") == "consumer" && (player.get("challenges") || []))
    let [claims, setClaims] = useState([])
    console.log("claims", claims)
    const producerCount = players.filter((player) => player.get("role") === "producer").length;
    const [claimSelections, setClaimSelections] = useState(Array(producerCount).fill(false));

    const handleButtonClick = (index) => {
        const newSelections = [...claimSelections];
        newSelections[index] = !newSelections[index];
        setClaimSelections(newSelections);
    };

    const allClaimsSelected = claimSelections.every((isSelected) => isSelected);

    // // challengeStatus = [{ 
    //     consumerID: "1",
    //     status: true,
    //     round: round
    //     
    // }]
    // for producer SIDE ^^^
    // har ek consumer ke liye ek status hoga
    /*
        for consumer SIDE
        {
            producerID: "1",
            status: true
            round: round
        }
    */
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
                // If prevClaims is not an array, initialize it as an empty array
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
                // If prevChallenges is not an array, initialize it as an empty array
                return [...putChallenges];
            }
        });
        // setChallenges((prevChallenges) => [...prevChallenges, ...putChallenges]);
        // console.log("basket", basket);
    }
    // useEffect(() => {
    //     if (role === "consumer") {

    //         console.log("In consumer rn")
    //         console.log("claims in useEffect", claims)
    //         console.log("challenges in useEffect", challenges)
    //         // player.set("basket", basket);

    //     }
    //     else {
    //         console.log("In producer rn")
    //     }
    // }, [])

    if (role === "consumer") {
        // const [challengeStatus, setChallengeStatus] = useState("No");
        const [wallet, setWallet] = useState(player.get("wallet"));
        // useEffect(() => {
        //   const initialStatuses = players.filter(p => p.get("role") === "producer")
        //     .reduce((acc, producer) => {
        //       acc[producer.id] = producer.round.get("challengeStatus") || "No";
        //       return acc;
        //     }, {});
        //   setChallengeStatuses(initialStatuses);
        // }, [players]);


        const handleSubmit = (basket) => {
            // This function submits the stage for the consumer and sets the challengeStatus
            // player.round.set("challengeStatus", challengeStatus)
            if (allClaimsSelected) {
                player.set("basket", basket); // Clear the basket
                player.set("challenges", challenges);
                player.stage.set("submit", true);
            }
            else {
                toast.error("Please select all checkboxes for the products before proceeding.");
            }

        }


        const getAllUniqueItems = (basket) => {
            console.log("basket in unique items", basket)
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

        console.log("basket", basket)
        console.log("challenges in export function", challenges)
        const [clicked, setClicked] = useState(false)


        // const renderConsumerFeedback = () => {

        //     // This function renders the feedback for the consumer

        //     // const challengeStatu
        //     // const [wallet, setWallet] = useState(player.get("wallet"))
        //     // const handleChallenge = (producer) => {
        //     //     if (producer.round.get("challengedClaim") == undefined || producer.round.get("challengedClaim") == "No") {
        //     //         producer.round.set("challengedClaim", "Yes")
        //     //         setChallengeStatus("Yes")
        //     //         setWallet(wallet - parseInt(producer.round.get("warrantPrice") / 10))
        //     //         player.set("wallet", wallet);
        //     //     }
        //     //     else {
        //     //         producer.round.set("challengedClaim", "No")
        //     //         setChallengeStatus("No")
        //     //         setWallet(wallet + parseInt(producer.round.get("warrantPrice") / 10))
        //     //         player.set("wallet", wallet);
        //     //     }

        //     // };

        //     return players
        //         .filter((p) => p.get("role") === "producer")
        //         .map((producer, index) => {
        //             <ConsumerFeedbackCard
        //                 producer={producer}
        //                 player={player}
        //                 index={index}
        //                 basket={basket}
        //                 round={round}
        //                 wallet={wallet}
        //                 setWallet={setWallet}
        //                 challenges={challenges}
        //                 setChallenges={setChallenges}
        //                 claims={claims}
        //                 setClaims={setClaims}
        //                 handleButtonClick={handleButtonClick}
        //             />
        //         });
        // }

        return (
            <div className="bg-gray-300 p-4 rounded-lg shadow-md mb-8">
                <h3><b>🛒 Your Consumer Summary</b></h3>
                {/* {renderConsumerFeedback()} */}
                {/* <renderConsumerFeedback /> */}
                <button onClick={() => {
                    handleClaims()
                    handleChallenges()
                    setClicked(!clicked)
                }}>Click here</button>

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
                <button className="bg-green-500 text-white py-3 px-6 text-lg rounded-md border-none cursor-pointer shadow-md transition-all duration-200 ease-in-out hover:bg-green-700 hover:shadow-md" onClick={() => handleSubmit(basket)}>Proceed to next round</button>
            </div>
        );
    }
    else if (!role) {
        return <div>Loading...</div>;
    }
    else if (role === "producer") {
        const handleProceed = () => {
            // This function submits the stage for the producer
            player.stage.set("submit", true);
        };

        const renderProducerFeedback = () => {
            // This function renders the feedback for the producer
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
                <button className="bg-green-500 text-white py-3 px-6 text-lg rounded-md border-none cursor-pointer shadow-md transition-all duration-200 ease-in-out hover:bg-green-700 hover:shadow-md" onClick={handleProceed}>Proceed to next round</button>
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





// User summary
// Challenge button if warrant is present