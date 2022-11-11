export const WEAPONS = [
  {
    id: "rock",
    beater_ids: ["paper"],
    crusher_ids: ["scissors"],
    src: "images/rock.png",
  },
  {
    id: "paper",
    beater_ids: ["scissors"],
    crusher_ids: ["rock"],
    src: "images/paper.png",
  },
  {
    id: "scissors",
    beater_ids: ["rock"],
    crusher_ids: ["paper"],
    src: "images/scissors.png",
  },
];

export const RESULTS = {
  wins: {
    id: "wins",
    message: "Congratulations, you won!",
    src: "images/win.jpeg",
  },
  loses: {
    id: "loses",
    message: "Sorry, you lost!",
    src: "images/lose.jpeg",
  },
  draws: {
    id: "draws",
    message: "It's a draw!",
    src: "images/draw.png",
  },
};
