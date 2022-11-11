import { useEffect, useState, Dispatch, SetStateAction } from "react";
import {
  BeaterIds,
  CrusherIds,
  PlayerProps,
  WeaponProps,
} from "../game/game.interface";
import styles from "./addWeapon.module.scss";

type AddWeaponProps = {
  weapons: WeaponProps[];
  setWeapons: Dispatch<SetStateAction<WeaponProps[]>>;
};

const AddWeapon = ({ weapons, setWeapons }: AddWeaponProps) => {
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedBeaters, setSelectedBeaters] = useState<BeaterIds>([]);
  const [selectedCrushers, setSelectedCrushers] = useState<CrusherIds>([]);
  const [selectedImage, setSelectedImage] = useState<Blob | MediaSource>();
  const [weaponName, setWeaponName] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  let successTimeout: NodeJS.Timeout;

  useEffect(() => {
    if (showSuccess) {
      successTimeout = setTimeout(() => {
        setShowSuccess(false);
        setShowModal(false);
      }, 3000);
    }
    return () => clearTimeout(successTimeout);
  }, [showSuccess]);

  const handleReset = () => {
    setShowModal(false);
    setShowSuccess(false);
    setErrors([]);
    setWeaponName("");
    setSelectedBeaters([]);
    setSelectedCrushers([]);
    setSelectedImage(undefined);
  };

  const handleRules = (
    weaponId: string,
    currentWeapons: string[],
    method: Dispatch<SetStateAction<string[]>>
  ) => {
    const tmpWeapons = [...currentWeapons];
    const index = tmpWeapons.indexOf(weaponId);
    if (index !== -1) {
      tmpWeapons.splice(index, 1);
    } else {
      tmpWeapons.push(weaponId);
    }
    method(tmpWeapons);
  };

  const createWeapon = () => {
    const tmpErrors = [];
    if (!weaponName.length) {
      tmpErrors.push("Weapon name can't be empty");
    }
    if (weapons.find((weapon) => weapon.id === weaponName)) {
      tmpErrors.push("Weapon name already exists");
    }
    if (weapons.length !== selectedBeaters.length + selectedCrushers.length) {
      tmpErrors.push("The weapon should include all possible rules");
    }

    setErrors(tmpErrors);

    if (!tmpErrors.length) {
      console.log(selectedImage);
      const newWeapon = {
        id: weaponName,
        beater_ids: selectedBeaters,
        crusher_ids: selectedCrushers,
        src: selectedImage
          ? URL.createObjectURL(selectedImage!)
          : "images/weapon.png",
      };
      const rpsPlayers: PlayerProps[] = JSON.parse(
        localStorage.getItem("rps_players")!
      );
      const currentPlayer = localStorage.getItem("current_rps_user");
      const tmpRpsPlayers = rpsPlayers.map((player) => {
        if (player.userName?.toLowerCase() === currentPlayer?.toLowerCase()) {
          return { ...player, weapons: [...player.weapons, newWeapon] };
        }
        return player;
      });
      localStorage.setItem("rps_players", JSON.stringify(tmpRpsPlayers));
      setShowSuccess(true);
      setWeapons((prevState) => [...prevState, newWeapon]);
    }
  };

  return (
    <>
      <button className={styles.addBtn} onClick={() => setShowModal(true)}>
        + Add a new weapon
      </button>
      {!!showModal && (
        <>
          <div onClick={handleReset} className={styles.weaponModalBackground} />
          <div className={styles.weaponModalWrapper}>
            {showSuccess ? (
              <h3>Weaopon successfully added</h3>
            ) : (
              <>
                <h3>Add new weapon</h3>
                <span onClick={handleReset} className={styles.reset}>
                  x
                </span>
                <div className={styles.content}>
                  <div>
                    <label>
                      Weapon name:
                      <input
                        type="text"
                        onChange={(e) => setWeaponName(e.target.value)}
                        value={weaponName}
                      />
                    </label>
                  </div>
                  <h5>Actions</h5>
                  <div className={styles.actions}>
                    <div className={styles.action}>
                      <span className={styles.beats}>Beats</span>
                      {weapons.map((weapon) => (
                        <label className={styles.weapon} key={weapon.id}>
                          {weapon.id}
                          <input
                            type="checkbox"
                            value={weapon.id}
                            onClick={() =>
                              handleRules(
                                weapon.id,
                                selectedBeaters,
                                setSelectedBeaters
                              )
                            }
                            disabled={selectedCrushers.includes(weapon.id)}
                          />
                        </label>
                      ))}
                    </div>
                    <div className={styles.action}>
                      <span className={styles.crushes}>Crushes</span>
                      {weapons.map((weapon) => (
                        <label className={styles.weapon} key={weapon.id}>
                          {weapon.id}
                          <input
                            type="checkbox"
                            value={weapon.id}
                            onClick={() =>
                              handleRules(
                                weapon.id,
                                selectedCrushers,
                                setSelectedCrushers
                              )
                            }
                            disabled={selectedBeaters.includes(weapon.id)}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className={styles.look}>
                    <label>
                      <h5>Weapon look</h5>
                      <img
                        alt="not fount"
                        src={
                          selectedImage
                            ? URL.createObjectURL(selectedImage!)
                            : "images/weapon.png"
                        }
                      />
                      <input
                        type="file"
                        name="myImage"
                        onChange={(event) => {
                          setSelectedImage(event?.target?.files?.[0]);
                        }}
                      />
                    </label>
                  </div>
                </div>
                {!!errors.length &&
                  errors.map((error) => (
                    <p className={styles.error} key={error}>
                      {error}
                    </p>
                  ))}
                <button className={styles.createBtn} onClick={createWeapon}>
                  Create the weapon
                </button>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default AddWeapon;
