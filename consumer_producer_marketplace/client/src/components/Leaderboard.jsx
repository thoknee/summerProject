import {
  Slider,
  usePlayer,
  usePlayers,
  useStage,
} from "@empirica/core/player/classic/react";
import React, { useState } from "react";
import { Button } from "./Button";
import { useEffect } from "react";
import "./Modal.css";
import "./Leaderboard.css";

const Leaderboard = (props) => {
  const players = usePlayers();
  const player = usePlayer();
  const stage = useStage();

  const [scores, setScores] = useState([]);

  const handleProceed = () => {
    player.stage.set("submit", true);
  };

  useEffect(() => {
    const sorted = players.sort(
      (prev, next) => next.get("score") - prev.get("score")
    ); // sort descending order
    const scoreElems = sorted.map((player) => (
      <div
        key={player.id}
        className="score-container"
        style={{
          backgroundColor: `${
            // A lighter shade of gray allows for score difference colors to be visible
            player.get("role") === `producer` ? `#DDDDDD` : `white`
          }`,
        }}
      >
        <p>
          <strong>{player.get("role")}</strong>
        </p>
        <p>
          <strong>{player.get("participantIdentifier")}</strong>
        </p>
        <p style={{color: player.get("scoreDiff") > 0 ? "green" : "red"}}>{player.get("score")}, {player.get("scoreDiff") > 0 ? "+" : "-"}{Math.abs(player.get("scoreDiff"))}</p>
      </div>
    ));
    setScores(scoreElems);
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <p>
            <strong>Market Leaderboard</strong>
          </p>
          <div className="score-display">{scores}</div>
          <Button
            handleClick={() => {
              if (props.setLeaderboard) props.setLeaderboard(false);
              handleProceed();
            }}
          >
            Proceed to next round
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
