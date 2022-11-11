import { useState } from "react";
import styles from "./welcome.module.scss";
import Instruction from "../../images/instruction.png";
import { WEAPONS } from "../../constants.js";
import { PlayerProps } from "../game/game.interface";

const ERROR_MESSAGE = "name can't be blank";

type WelcomeProps = {
  setUserSubmitted: (submitted: boolean) => void;
  setChangeUser: (change: boolean) => void;
};

const Welcome = ({ setUserSubmitted, setChangeUser }: WelcomeProps) => {
  const [nickName, setNickName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleChange = (value: string) => {
    setError(value ? "" : ERROR_MESSAGE);
    setNickName(value);
    setChangeUser(false);
    setUserSubmitted(false);
  };

  const updateSession = () => {
    const playersData = localStorage.getItem("rps_players");
    if (!playersData) {
      localStorage.setItem(
        "rps_players",
        JSON.stringify([
          {
            userName: nickName,
            weapons: WEAPONS,
            scores: {},
          },
        ])
      );
    } else {
      const players = JSON.parse(playersData);
      const existingPlayer = players.find(
        (player: PlayerProps) =>
          player.userName.toLowerCase() === nickName.toLowerCase()
      );
      if (!existingPlayer) {
        localStorage.setItem(
          "rps_players",
          JSON.stringify([
            ...players,
            {
              userName: nickName,
              weapons: WEAPONS,
              scores: {},
            },
          ])
        );
      }
    }
    localStorage.setItem("current_rps_user", nickName);
  };

  const handleSave = () => {
    if (!nickName) {
      setError(ERROR_MESSAGE);
    } else {
      updateSession();
      setUserSubmitted(true);
    }
  };

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === "Enter") {
      handleSave();
    }
  };

  return (
    <>
      <div className={styles.wrapper}></div>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Hey! <br /> Welcome to play Rock Paper Scissors game!
        </h2>

        <p>Please create a nickname to save your game progress.</p>
        <div>
          <input
            type="text"
            placeholder="your nikname.."
            value={nickName}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSave}>Go</button>
          <span className={styles.error}>{error}</span>
        </div>
        <img
          className={styles.instruction}
          src={Instruction}
          alt="Instruction"
        />
      </div>
    </>
  );
};

export default Welcome;
