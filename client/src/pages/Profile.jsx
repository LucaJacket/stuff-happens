import { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { useTheme } from "../contexts/ThemeContext";
import { LogoutButton } from "../components/AuthComponents";
import History from "../components/History";
import { listGames } from "../api/index.mjs";

function Profile({ handleLogout, setMessage, user }) {
  const { darkMode } = useTheme();

  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);

  useEffect(() => {
    listGames()
      .then(setGames)
      .catch((err) => setMessage({ title: "Errore", body: err.message }))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <Row className="justify-content-center my-5">
        <Spinner animation="border" />
      </Row>
    );

  return (
    <>
      <Row className="justify-content-center my-5">
        <Col md={6} className="text-center">
          <h1 className="display-4 mb-3">Profilo</h1>
          <p className="lead">Username: {user.username}</p>
          <p className="lead">Email: {user.email}</p>
          <div className="mt-4">
            <LogoutButton darkMode={darkMode} handleLogout={handleLogout} />
          </div>
        </Col>
      </Row>
      <Row className="mb-5">
        <History games={games} />
      </Row>
    </>
  );
}

export default Profile;
