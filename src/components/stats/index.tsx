import { memo, useEffect, useState } from "react";
import { OutcomeProps, PlayerProps, ScoreProps } from "../game/game.interface";
import styles from "./stats.module.scss";

type StatsProps = {
  playerScore: ScoreProps;
  players: PlayerProps[];
};

const calcScore = (scores: OutcomeProps) => {
  return scores.wins * 3 + scores.draws || 0;
};

const leaderboardSorting = (a: PlayerProps, b: PlayerProps) => {
  return calcScore(b.scores) - calcScore(a.scores);
};

const Stats = ({ playerScore, players }: StatsProps) => {
  const [sortedLeaderboard, setSortedLeaderboard] = useState<PlayerProps[]>([]);

  useEffect(() => {
    setSortedLeaderboard(players.sort(leaderboardSorting));
  }, [players]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.leaderBoardTitle}>
        <h2>Leaderboard</h2>
        <div className={styles.tooltip}>
          <img src="images/info_icon.png" />
          <span className={styles.tooltiptext}>
            Score calculation is done as in football. 3 points for a win. 1
            point for a draw
          </span>
        </div>
      </div>
      <div className={styles.score}>
        {sortedLeaderboard.map((player) => (
          <div className={styles.leaderItem} key={player.userName}>
            <span>{player.userName}:</span>
            <span> {calcScore(player.scores)} points</span>
          </div>
        ))}
      </div>
      <h2>Your score</h2>
      <div className={styles.scores}>
        <div className={styles.score}>
          Wins: <span className={styles.num}>{playerScore.wins}</span>
        </div>
        <div className={styles.score}>
          Loses: <span className={styles.num}>{playerScore.loses}</span>
        </div>
        <div className={styles.score}>
          Draws: <span className={styles.num}>{playerScore.draws}</span>
        </div>
        <div className={styles.score}>
          Total: <span className={styles.num}>{playerScore.total}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(Stats);
