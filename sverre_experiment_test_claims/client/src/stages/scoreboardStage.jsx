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
    player.stage.set("submit", true);
  };

  return (
    <div>
      <h2 style={styles.heading}>Scoreboard</h2>
      <table style={styles.scoreboardTable}>
        <thead>
          <tr style={styles.tableHeader}>
            <th>ID</th>
            <th>Score</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((p) => (
            <tr key={p.id} style={styles.tableRow}>
              <td>{p.id}</td>
              <td>{p.get("score")}</td>
              <td>{p.get("role")}</td>
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
    // ... existing styles ...
  },
  heading: {
    textAlign: 'center',
    color: '#0056b3',
    fontSize: '24px',
    marginBottom: '20px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  scoreboardTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    marginBottom: '20px',
  },
  tableHeader: {
    backgroundColor: '#003366', // Dark blue background
    color: 'white',
  },
  tableRow: {
    borderBottom: '1px solid #ddd',
  },
  th: {
    padding: '12px',
    textAlign: 'left',
  },
  td: {
    borderBottom: '1px solid #ddd',
    padding: '8px',
  }
};
