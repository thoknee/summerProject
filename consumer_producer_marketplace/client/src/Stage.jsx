import {
  usePlayer,
  usePlayers,
  useRound,
  useStage,
} from "@empirica/core/player/classic/react";
import { Loading } from "@empirica/core/player/react";
import React from "react";
import { SelectRolesStage } from "./stages/SelectRoleStage";
import { QualityStage } from "./stages/qualityStage";
import { ClaimsStage } from "./stages/claimsStage";
import { DeliberateStage } from "./stages/deliberateStage";
import { ChoiceStage } from "./stages/choiceStage";
import { FeedbackStage } from "./stages/feedbackStage";
// import { ScoreboardStage } from "./stages/scoreboardStage";
import Leaderboard from "./components/Leaderboard";

export function Stage() {
  const player = usePlayer();
  const players = usePlayers();
  const round = useRound();
  const stage = useStage();

  if (player.stage.get("submit")) {
    if (players.length === 1) {
      return <Loading />;
    }

    return (
      <div className="text-center text-gray-400 pointer-events-none">
        Please wait for other player(s).
      </div>
    );
  }

  switch (stage.get("name")) {
    case "selectRoleStage":
      return <SelectRolesStage/>;
    case "qualityStage":
      return <QualityStage />;
    case "claimsStage":
      return <ClaimsStage round={round}/>;
    case "deliberateStage":
      return <DeliberateStage />;
    case "choiceStage":
      return <ChoiceStage/>;
    case "feedbackStage":
      return <FeedbackStage/>;
    case "scoreboardStage":
      return <Leaderboard/>;
    default:
      return <Loading/>;
  }
}
