import React from "react";
import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";

export function ScoreboardStage() {
  const player = usePlayer();
  const players = usePlayers();

  // Sort players by score in descending order
  const sortedPlayers = players.slice().sort((a, b) => {
    const scoreA = a.get("score") || 0;
    const scoreB = b.get("score") || 0;
    return scoreB - scoreA;
  });

  const handleProceed = () => {
    console.log(player.get("role"))
    player.stage.set("submit", true);
  };

  return (
    <div>
      <h2 style={styles.heading}>Leaderboard</h2>
      <table style={styles.scoreboardTable}>
        <thead>
          <tr style={styles.tableHeader}>
            <th>ID</th>
            <th>Role</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((p) => (
            <tr key={p.id} style={p.id === player.id ? styles.highlightedRow : styles.tableRow}>
              <td>{p.id}</td>
              <td>{p.get("role")}</td>
              <td>{p.get("score")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button style={styles.proceedButton} onClick={handleProceed}>Proceed to Next Round</button>
    </div>
  );
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
},
  heading: {
    textAlign: 'center',
    color: '#000000',
    fontSize: '24px',
    marginBottom: '20px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  scoreboardTable: {
    width: '100%',
    borderCollapse: 'collapse',
    borderSpacing: '15px', 
    marginTop: '20px',
    marginBottom: '20px',
    fontSize: '1.2em', // Increase font size by 20%
  },
  tableHeader: {
    backgroundColor: '#003366', // Dark blue background
    color: 'white',
  },
  tableRow: {
    borderBottom: '1px solid #ddd',
  },
  th: {
    padding: '15px', // Increased padding
    textAlign: 'left',
  },
  td: {
    borderBottom: '1px solid #ddd',
    padding: '12px', // Increased padding
  },
  highlightedRow: {
    borderBottom: '1px solid #ddd',
    backgroundColor: '#e6f7ff', // Light blue background for the current player's row
    padding: '12px', // Increased padding
  }

};
