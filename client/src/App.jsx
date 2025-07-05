import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router";
import DefaultLayout from "./layouts/DefaultLayout";
import Game from "./pages/Game";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { LoginForm } from "./components/AuthComponents";
import { logIn, getUserInfo, logOut } from "./api/index.mjs";

function App() {
  const [message, setMessage] = useState(null);

  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserInfo()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await logIn(credentials);
      if (user) {
        setUser(user);
        setMessage({
          title: "Login effettuato",
          body: `Bentornato/a ${user.username}!`,
        });
      }
      return !!user;
    } catch (err) {
      setMessage({ title: "Errore", body: err.message });
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      setUser(null);
      setMessage({
        title: "Logout effettuato",
        body: "Alla prossima!",
      });
    } catch (err) {
      setMessage({ title: "Errore", body: err.message });
    }
  };

  const loggedIn = !!user;

  return (
    <Routes>
      <Route element={<DefaultLayout loggedIn={!!user} message={message} />}>
        <Route
          path="/"
          element={<Home loggedIn={loggedIn} setMessage={setMessage} />}
        />
        <Route
          path="/login"
          element={
            loggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <LoginForm handleLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/profile"
          element={
            loggedIn ? (
              <Profile
                handleLogout={handleLogout}
                setMessage={setMessage}
                user={user}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/games/:id"
          element={<Game loggedIn={loggedIn} setMessage={setMessage} />}
        />
        <Route path="*" />
      </Route>
    </Routes>
  );
}

export default App;
