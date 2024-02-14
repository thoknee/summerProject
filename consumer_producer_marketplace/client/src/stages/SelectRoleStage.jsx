/*
player.get("role") is used to fetch roles of the players.
round.get("name") is used to fetch the name of the round.
player.set("capital", 100) is used to set the initial capital of the producer.
player.set("capital", player.get("capital") + 20) is used to update the capital of the producer each round.
player.set("wallet", 20) is used to set the initial wallet of the consumer.
player.set("wallet", player.get("wallet") + 10) is used to update the wallet of the consumer each round.
player.round.set("brandName", randomBrandName()) is used to set the brand name of the producer.
player.stage.set("submit", true) is used to set the stage of each player to submit.
*/

import React from "react";
import { usePlayer, useRound } from "@empirica/core/player/classic/react";
// import { useGame } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";

export function SelectRolesStage() {
    const player = usePlayer();
    const round = useRound();

    // Used for multiplayer version
    // const game = useGame();
    // const treatment = game.get("treatment");
    // const shareOfProducers = treatment.producerPercentage

    function handleSubmit() {
        /*
        function to handle the submit button click. It sets the initial capital and wallet for the producer and consumer respectively. It also sets the brand name for the producer.
        */

        if (player.get("role") === "producer") {
            player.round.set("brandName", randomBrandName());

            if (round.get("name") == "Round1") {
                player.set("capital", 100);
            }
            if (round.get("name") != "Round1") {
                player.set("capital", player.get("capital") + 20)
            }
        }

        else {
            if (round.get("name") == "Round1") {
                player.set("wallet", 20);
            }
            if (round.get("name") != "Round1") {
                player.set("wallet", player.get("wallet") + 10)
            }
        }
        player.round.set("round", round.get("name"));
        player.stage.set("submit", true);

    }

    function randomBrandName() {
        /*
        Used to generate a random brand name for the product.
        */
        
        const names = ["Ralph", "Mario", "Steve", "Dazai", "Jason", "Aran",
            "Lara", "Joseph", "Nathan", "Niko", "Ezio", "Kenneth", "Marlon", "Josue",
            "Admilton", "Isa", "Jerry", "Parker", "Wayne", "West", "Kent", "Allen", "Stark"];
        const chosenName = names[Math.floor(Math.random() * names.length)];
        const nums = Math.floor(Math.random() * 999) + 1;
        return `${chosenName}${nums}`;
    }

    function ProducerInfo() {
        /*
        Used to display the information about the Producer.
        */
        return (
            <div className="max-w-screen-2xl px-4 mx-auto mt-8 sm:mt-12 sm:px-6 md:mt-16">
                <div className="lg:grid lg:grid-cols-16 lg:gap-16">
                    <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                        <div className="text-sm font-semibold tracking-wide text-gray-500 uppercase sm:text-base lg:text-sm xl:text-base">
                            Welcome
                        </div>
                        <h2
                            className="mt-1 text-4xl font-extrabold leading-10 tracking-tight text-gray-900 sm:leading-none sm:text-6xl lg:text-5xl xl:text-6xl">
                            Producers! 🌟
                        </h2>
                        <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl" style={{ whiteSpace: 'nowrap' }}>
                            As a producer, your main goal is to maximize your profits! 💰 Each round presents a new opportunity for you to shine. <br/>
                            You get to decide what kind of products you'll produce and the best way to advertise them. Remember, premium products usually fetch a higher price! 💎
                        </p>
                        <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl" style={{ whiteSpace: 'nowrap' }}>
                            Here's the catch: every round, you'll use all your capital (that's your hard-earned money 💵) to create products of the quality you choose. <br/>
                            But be strategic! The consumers only learn about the true quality of your product after they buy it. So, think carefully about your production and advertising choices.
                        </p>
                        <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl" style={{ whiteSpace: 'nowrap' }}>
                            And don't forget, you're not alone in this game! Other producers are out there, trying to make their mark just like you. Keep an eye on the competition while you plot your path to success. 🏭👀
                        </p> 
                    <br/>
                    <p className="mt-6 text-2xl text-gray-600 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl" style={{ whiteSpace: 'nowrap' }}>
                        Are you ready to take on the challenge and become the top producer? Let's get started! 🚀🏆
                    </p>
                </div>
            </div>
        </div>
        );
    };
    


    function ConsumerInfo() {
        /*
        Used to display the information about the Consumer.
        */
        return (
            <div className="max-w-screen-2xl px-4 mx-auto mt-8 sm:mt-12 sm:px-6 md:mt-16">
                <div className="lg:grid lg:grid-cols-16 lg:gap-16">
                    <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                        <div className="text-sm font-semibold tracking-wide text-gray-500 uppercase sm:text-base lg:text-sm xl:text-base">
                            Welcome
                        </div>
                        <h2
                            className="mt-1 text-4xl font-extrabold leading-10 tracking-tight text-gray-900 sm:leading-none sm:text-6xl lg:text-5xl xl:text-6xl">
                            Consumers! 🛒
                        </h2>
                        <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl" style={{ whiteSpace: 'nowrap' }}>
                            As a savvy consumer, your mission is to make smart buying decisions! 🧐 Every round is a new adventure in the marketplace, where you'll encounter a variety of products. <br/>
                            Your goal is to get the best value for your money. Remember, not all that glitters is gold! 🌟
                        </p>
                        <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl" style={{ whiteSpace: 'nowrap' }}>
                            Here's the twist: you'll be spending from your wallet 💸, but beware! The true quality of products is only revealed after purchase. <br/>
                            So, use your intuition and make your choices wisely. Are the producers bluffing with their ads? Or is it really a deal of a lifetime? 🕵️‍♀️
                        </p>
                        <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl" style={{ whiteSpace: 'nowrap' }}>
                            Remember, you're competing against other consumers to be the most astute shopper. Keep an eye on your wallet and don't get swayed by every shiny ad! 🛍️💡
                        </p> 
                    <br/>
                    <p className="mt-6 text-2xl text-gray-600 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl" style={{ whiteSpace: 'nowrap' }}>
                    Ready to embark on this shopping spree and make some clever purchases? Let's dive into the world of consumer wisdom! 🚀🛍️
                    </p>
                </div>
            </div>
        </div>
        );
    };

    if (player.get("role") === "consumer") {
        return (
            <div className="md:min-w-96 lg:min-w-128 xl:min-w-192 flex flex-col items-center space-y-10 p-4">
                <p>You will play as a <b>{player.get("role")}</b>!</p>
                <ConsumerInfo />
                <Button handleClick={handleSubmit}>
                    I'm ready!
                </Button>
            </div>
        )
    }

    else if (player.get("role") === "producer") {
        return (
            <div className="md:min-w-96 lg:min-w-128 xl:min-w-192 flex flex-col items-center space-y-10 p-4">
                <p>You will play as a <b>{player.get("role")}</b>!</p>
                <ProducerInfo />
                <Button handleClick={handleSubmit}>
                    I'm ready!
                </Button>
            </div>
        )
    }

    else {
        return (
            <div className="md:min-w-96 lg:min-w-128 xl:min-w-192 flex flex-col items-center space-y-10 p-4">
                <p>Role assignment failed. Contact research staff.</p>
            </div>
        );
    }
}
