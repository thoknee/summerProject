import { usePlayer } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";
import React, { useState, useEffect } from "react";
import { PayoffMatrix } from "../components/PayoffMatrix";
import { MakeQualityOption } from "../components/OptionButton";

export function QualityStage() {
    const highQualityImg = "/graphics/PremiumToothpasteAI.png";
    const lowQualityImg = "/graphics/StandardToothpasteAI.png";

    const player = usePlayer();

    function handleSubmit() {
        if (role === "producer") {
            player.stage.set("submit", true);
            // TODO: Remove hardcoded values
            player.round.set("productQuality", selectedIdx === 0 ? "low" : "high");
            player.round.set("productCost", selectedIdx === 0 ? "1" : "2");
        }
    }

    function handleProceed() {
        player.stage.set("submit", true);
    }

    const role = player.get("role");
    if (role === "consumer") {
        return (
            <div style={styles.waitingScreen}>
                <ConsumerWaitingMessage />
                <button onClick={handleProceed} style={styles.proceedButton}>Proceed to next round</button>
            </div>
        );
    }

    const [selectedIdx, setSelectedIdx] = useState(-1);

    return (
        <div className="flex flex-col -top-6 justify-center border-3 border-indigo-800 p-6 rounded-lg shadow-md relative mt-16">

            <h1 className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-yellow-200 border-2 border-teal-600 pl-2 pr-2 rounded-lg text-lg mb-4" style={{ fontFamily: "'Archivo', sans-serif", whiteSpace: 'nowrap', textAlign: 'center' }}>
                Choose Quality
            </h1>
            <h1 className="flex justify-center mt-2 mb-6">You are a producer of toothpaste, and you may choose what quality you would like to produce.</h1>

            <div className="flex justify-center gap-10 items-center">
            <MakeQualityOption
                quality={"low"}
                imgUrl={lowQualityImg}
                selectedIdx={selectedIdx}
                setSelectedIdx={setSelectedIdx} />

            <MakeQualityOption
                quality={"high"}
                imgUrl={highQualityImg}
                selectedIdx={selectedIdx}
                setSelectedIdx={setSelectedIdx} />
            </div>

            <div className="flex justify-center items-center">
                <Button handleClick={handleSubmit} style={{ width: "200px" }}>
                Next Page →
                </Button>
            </div>
        </div>
    );
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
            <p>For convenience, the table below represents how many points you would gain/lose for each possible
                combination of the quality you pay for and the quality you actually receive:</p>
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
    waitingScreen: {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        maxWidth: '500px',
        margin: '20px auto',
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
};