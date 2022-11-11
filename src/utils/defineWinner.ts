import { WeaponProps, Results } from "../components/game/game.interface.js";
import { WEAPONS, RESULTS } from "../constants.js";

const getRandomWeapon = () =>
  WEAPONS[Math.floor(Math.random() * WEAPONS.length)];

const defineWinner = (usersWeapon: WeaponProps): [WeaponProps, Results] => {
  const myWeapon = getRandomWeapon();

  if (usersWeapon.crusher_ids.includes(myWeapon.id)) {
    return [myWeapon, RESULTS["wins"]];
  } else if (usersWeapon.beater_ids.includes(myWeapon.id)) {
    return [myWeapon, RESULTS["loses"]];
  }
  return [myWeapon, RESULTS["draws"]];
};

export default defineWinner;
