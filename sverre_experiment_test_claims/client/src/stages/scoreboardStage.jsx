import React from "react";
import { usePlayer } from "@empirica/core/player/classic/react";


export function ScoreboardStage(){

    const player = usePlayer();

    const handleProceed = () => {
        player.stage.set("submit", true);
      };

    return(
        <div>
            <div>Scoreboard here</div>
            <button style = {styles.proceedButton} onClick={handleProceed}>Proceed to next round</button>
        </div>
    )
}

const styles = {
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
      }
};