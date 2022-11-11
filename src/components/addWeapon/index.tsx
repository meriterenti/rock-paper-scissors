import { useEffect, useState } from "react";
import { WEAPONS } from "../../constants";
import { BeaterIds, CrusherIds, PlayerProps } from "../game/game.interface";
import styles from "./addWeapon.module.scss";

const AddWeapon = () => {
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
    method: React.Dispatch<React.SetStateAction<string[]>>
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
    if (WEAPONS.find((weapon) => weapon.id === weaponName)) {
      tmpErrors.push("Weapon name already exists");
    }
    if (WEAPONS.length !== selectedBeaters.length + selectedCrushers.length) {
      tmpErrors.push("The weapon should include all possible rules");
    }

    setErrors(tmpErrors);

    if (!tmpErrors.length) {
      const newWeapon = {
        id: weaponName,
        beater_ids: selectedBeaters,
        crusher_ids: selectedCrushers,
        src: selectedImage
          ? URL.createObjectURL(selectedImage!)
          : "images/draw.png",
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
    }
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>Add a new weapon</button>
      {!!showModal && (
        <>
          <div onClick={handleReset} className={styles.weaponModalBackground} />
          <div className={styles.weaponModalWrapper}>
            {showSuccess ? (
              <p>Weaopon successfully added</p>
            ) : (
              <>
                <label>
                  New weapon name:
                  <input
                    type="text"
                    onChange={(e) => setWeaponName(e.target.value)}
                    value={weaponName}
                  />
                </label>
                <label>
                  New weapon beats:
                  {WEAPONS.map((weapon) => (
                    <label key={weapon.id}>
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
                </label>
                <label>
                  New weapon crushes:
                  {WEAPONS.map((weapon) => (
                    <label key={weapon.id}>
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
                </label>
                <label>
                  New weapon look:
                  <img
                    alt="not fount"
                    src={
                      selectedImage
                        ? URL.createObjectURL(selectedImage!)
                        : "images/draw.png"
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
                <button onClick={createWeapon}>Create The Weapon</button>
                {!!errors.length &&
                  errors.map((error) => <p key={error}>{error}</p>)}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default AddWeapon;
