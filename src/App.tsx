import { useState } from "react";
import Game from "./components/game";
import Welcome from "./components/welcome";

const App = () => {
  const [userSubmitted, setUserSubmitted] = useState(false);
  const [changeUser, setChangeUser] = useState(false);
  const currentUser = localStorage.getItem("current_rps_user");

  return (
    <div className="app">
      {(userSubmitted || currentUser) && !changeUser ? (
        <Game setChangeUser={setChangeUser} />
      ) : (
        <Welcome
          setUserSubmitted={setUserSubmitted}
          setChangeUser={setChangeUser}
        />
      )}
    </div>
  );
};

export default App;
