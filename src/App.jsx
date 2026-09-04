import {
  useEffect,
} from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home.jsx";
import NewGame from "./pages/NewGame.jsx";
import Game from "./pages/Game.jsx";
import Statistics from "./pages/Statistics.jsx";

import {
  getSettings,
} from "./utils/settings.js";

function App() {
  useEffect(() => {
    const settings =
      getSettings();

    document.documentElement.dataset.theme =
      settings.theme;
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/new-game"
          element={<NewGame />}
        />

        <Route
          path="/game"
          element={<Game />}
        />

        <Route
          path="/statistics"
          element={
            <Statistics />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;