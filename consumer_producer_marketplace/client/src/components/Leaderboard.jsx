import {
  Slider,
  usePlayer,
  usePlayers,
  useStage,
} from "@empirica/core/player/classic/react";
import React, { useState } from "react";
import { Button } from "./Button";
import { useEffect } from "react";
import { get, post } from "../util";
import "./Modal.css";
import "./Leaderboard.css";

const Leaderboard = (props) => {
  const player = usePlayer();
  const players = usePlayers();
  const stage = useStage();

  const [scores, setScores] = useState([]);

  const handleProceed = () => {
    player.stage.set("submit", true);
  };

  useEffect(() => {
    get("/leaderboard").then((res) => {
      console.log(res);
      const scoreElems = [];
      for (const scoreInfo of res.scores) {
        scoreElems.push(
          <div key={scoreInfo._id} className="score-container">
            <p>
              <strong>{scoreInfo.identifier}</strong>
            </p>
            <p>{scoreInfo.score}</p>
          </div>
        );
      }
      setScores(scoreElems);
    });
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