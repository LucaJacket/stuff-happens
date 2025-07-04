import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router";

import DefaultLayout from "./components/DefaultLayout";
import { LoginForm } from "./components/AuthComponents";
import NotFound from "./components/NotFound";
import Landing from "./components/Landing";
import GameLayout from "./components/GameLayout";
import Game from "./components/Game";
import Round from "./components/Round";
import Profile from "./components/Profile";
import API from "./API/API.mjs";

function App() {
  const navigate = useNavigate();

  const [playing, setPlaying] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch { }
    };
    checkAuth();
  }, []);

  const handleError = async (fn) => {
    try {
      return await fn();
    } catch (error) {
      setMessage({ title: "Errore", body: error.message });
      navigate("/");
      return false;
    }
  };

  const handleLogin = async (credentials) => {
    const login = async () => {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({ title: "Login effettuato", body: `Bentornato, ${user.username}!` });
      setUser(user);
    };
    return await handleError(login);
  };

  const handleLogout = async () => {
    const logout = async () => {
      await API.logOut();
      setLoggedIn(false);
      setMessage({ title: "Logout effettuato", body: "Alla prossima!" });
      setUser("");
    };
    return await handleError(logout);
  };

  const handleNewGame = async () => {
    const newGame = async () => {
      const gameId = await API.addGame();
      setPlaying(true);
      navigate(`/games/${gameId}`);
    };
    return await handleError(newGame);
  };

  return (
    <Routes>
      <Route
        element={<DefaultLayout loggedIn={loggedIn} message={message} playing={playing} />}
      >
        <Route
          path="/"
          element={
            <Landing
              loggedIn={loggedIn}
              handleNewGame={handleNewGame}
            />
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute loggedIn={loggedIn}>
              <LoginForm handleLogin={handleLogin} />
            </PublicRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute loggedIn={loggedIn}>
              <Profile user={user} handleLogout={handleLogout} handleError={handleError} />
            </ProtectedRoute>
          }
        />
        <Route path="/games/:gameId" element={<GameLayout handleError={handleError} />}>
          <Route index element={
            <Game
              loggedIn={loggedIn}
              handleNewGame={handleNewGame}
              handleError={handleError}
              setMessage={setMessage}
              setPlaying={setPlaying}
            />
          }
          />
          <Route path="rounds/:roundId" element={
            <Round
              handleError={handleError}
              setMessage={setMessage}
            />
          }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function ProtectedRoute({ children, loggedIn }) {
  return loggedIn ? children : <Navigate to="/" replace />;
}

function PublicRoute({ children, loggedIn }) {
  return !loggedIn ? children : <Navigate to="/" replace />;
}

export default App;