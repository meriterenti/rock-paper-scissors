import { WeaponProps, Results } from "../components/game/game.interface.js";
import { RESULTS } from "../constants.js";

const defineWinner = (
  usersWeapon: WeaponProps,
  weapons: WeaponProps[]
): [WeaponProps, Results] => {
  const myWeapon = weapons[Math.floor(Math.random() * weapons.length)];

  if (usersWeapon.crusher_ids.includes(myWeapon.id)) {
    return [myWeapon, RESULTS["wins"]];
  } else if (usersWeapon.beater_ids.includes(myWeapon.id)) {
    return [myWeapon, RESULTS["loses"]];
  }
  return [myWeapon, RESULTS["draws"]];
};

export default defineWinner;
