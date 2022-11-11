import { useEffect, useState } from "react";
import styles from "./game.module.scss";
import { WEAPONS, RESULTS } from "../../constants.js";
import defineWinner from "../../utils/defineWinner";
import Stats from "../stats";
import AddWeapon from "../addWeapon";
import {
  PlayerProps,
  ScoreProps,
  WeaponProps,
  Results,
} from "./game.interface";

type GameProps = {
  setChangeUser: (change: boolean) => void;
};



const intialPlayerScore = {
  wins: 0,
  loses: 0,
  draws: 0,
  total: 0,
};

const emptyWeapon = {
  id: "",
  beater_ids: [],
  crusher_ids: [],
  src: "",
};

const emptyResult = {
  message: "",
  src: "",
  id: "",
}

const Game = ({ setChangeUser }: GameProps) => {
  const playersData: string | null = localStorage.getItem("rps_players");
  const currentUser = localStorage.getItem("current_rps_user");
  const players: PlayerProps[] = playersData ? JSON.parse(playersData) : [];
  const currentPlayer = players.find(
    (player) => player.userName.toLowerCase() === currentUser?.toLowerCase()
  );

  const [counter, setCounter] = useState<number>(3);
  const [result, setResult] = useState<Results>(emptyResult);
  const [usersWeapon, setUsersWeapon] = useState<WeaponProps>(emptyWeapon);
  const [myWeapon, setMyWeapon] = useState<WeaponProps>(emptyWeapon);
  const [playerScore, setPlayerScore] = useState<ScoreProps>(
    currentPlayer?.scores.total ? currentPlayer?.scores : intialPlayerScore
  );

  type PlayerScoreKey = keyof typeof playerScore;

  let timeOut: NodeJS.Timeout;

  useEffect(() => {
    if (counter > 0) {
      timeOut = setTimeout(() => {
        setCounter(counter - 1);
      }, 1000);
    }

    if (counter === 0 && !result.message) {
      setResult(RESULTS["loses"]);
      setPlayerScore((prevState) => ({
        ...prevState,
        loses: prevState.loses + 1,
        total: prevState.total + 1,
      }));
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [counter]);

  useEffect(() => {
    if (playerScore.total) {
      const playersWithUpdatedScores = players.map((player) => {
        if (player.userName.toLowerCase() === currentUser?.toLowerCase()) {
          return {
            ...player,
            scores: playerScore,
          };
        }
        return player;
      });
      localStorage.setItem(
        "rps_players",
        JSON.stringify(playersWithUpdatedScores)
      );
    }
  }, [playerScore]);

  const handleWeaponSelect = (weapon: WeaponProps): void => {
    const [myWeapon, result] = defineWinner(weapon);
    setUsersWeapon(weapon);
    setMyWeapon(myWeapon);

    setResult(result);
    const resultId = result.id as PlayerScoreKey
    
    setPlayerScore((prevState) => ({
      ...prevState,
      [resultId]: prevState[resultId] + 1,
      total: prevState.total + 1,
    }));
  };

  const handleReset = () => {
    clearTimeout(timeOut);
    setCounter(3);
    setResult(emptyResult);
    setUsersWeapon(emptyWeapon);
    setMyWeapon(emptyWeapon);
  };

  const handlePlayerChange = () => {
    localStorage.removeItem("current_rps_user");
    setChangeUser(true);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.gameContainer}>
        <button className={styles.changeUserBtn} onClick={handlePlayerChange}>
          Change player
        </button>
        {result.message ? (
          <div className={styles.results}>
            <h3>{result.message}</h3>
            <div className={styles.imgContainer}>
              <img src={result.src} />
            </div>
            {usersWeapon.id && (
              <div className={styles.competitors}>
                <div className={styles.competitor}>
                  <span>You</span>
                  <img src={usersWeapon.src} alt={usersWeapon.id} />
                </div>
                <div className={styles.competitor}>
                  <span>Computer</span>
                  <img src={myWeapon.src} alt={myWeapon.id} />
                </div>
              </div>
            )}
            <button className={styles.resetBtn} onClick={handleReset}>
              Give it another shot
            </button>
          </div>
        ) : (
          <>
            <div className={styles.counter}>{counter}</div>
            <h2 className={styles.title}>Please choose a weapon</h2>
            <div className={styles.weapons}>
              {WEAPONS.map((weapon) => (
                <div
                  className={styles.weapon}
                  key={weapon.id}
                  onClick={() => handleWeaponSelect(weapon)}
                >
                  <img src={weapon.src} alt={weapon.id} />
                  <span>{weapon.id}</span>
                </div>
              ))}
            </div>
          </>
        )}
        <AddWeapon />
      </div>
      <div className={styles.scoreContainer}>
        <Stats playerScore={playerScore} players={players} />
      </div>
    </div>
  );
};

export default Game;
