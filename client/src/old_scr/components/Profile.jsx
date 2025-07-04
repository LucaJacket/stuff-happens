import { useEffect, useState } from "react";
import { Button, Card, Col, Collapse, Container, Row } from "react-bootstrap";
import { LogoutButton } from "./AuthComponents";
import { LoadingSpinner } from "./GameComponents";
import API from "../API/API.mjs";

function Profile({ user, handleLogout, handleError }) {
  return (
    <Container fluid className="d-flex flex-column p-3 align-items-center gap-5">
      <Container fluid className="text-center">
        <h1 className="display-4 mb-3">Profilo</h1>
        <p className="lead">Username: {user.username}</p>
        <p className="lead">Email: {user.email}</p>
        <LogoutButton handleLogout={handleLogout} />
      </Container>
      <History handleError={handleError} />
    </Container>
  );
}

function History({ handleError }) {
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);

  useEffect(() => {
    const getGames = async () => {
      let games = await API.getGames();
      games = await Promise.all(
        games.map(async (game) => {
          let rounds = await API.getRounds(game.id);
          rounds = await Promise.all(
            rounds.map(async (round) => {
              const card = await API.getCard(game.id, round.id);
              return { ...round, card };
            })
          );
          return { ...game, rounds };
        })
      );
      setGames(games);
      setLoading(false);
    }
    handleError(getGames);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container fluid className="text-center">
      <h1 className="display-4 mb-3">Cronologia</h1>
      {games.length === 0
        ? <p className="lead">Non hai ancora giocato nessuna partita.</p>
        : games.map((game) => 
          <HistoryRow key={game.id} game={game} />)}
    </Container>
  );
}

function HistoryRow({ game }) {
  const STATUS = {
    1: "Vittoria",
    0: "Sconfitta",
    "-1": "Non terminata"
  };

  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <Card className="bg-black text-white text-center mb-3">
        <Card.Body>
          <Row className="align-items-center me-3">
            <Col>
              <Card.Text className="lead">Data</Card.Text>
              <Card.Text>{game.createdAt}</Card.Text>
            </Col>
            <Col>
              <Card.Text className="lead">Round giocati</Card.Text>
              <Card.Text>
                {game.rounds.length - game.rounds.filter((round) => round.number === 0).length}
              </Card.Text>
            </Col>
            <Col>
              <Card.Text className="lead">Carte raccolte</Card.Text>
              <Card.Text>{game.rounds.filter((round) => round.won === 1).length}</Card.Text>
            </Col>
            <Col>
              <Card.Text className="lead">Esito</Card.Text>
              <Card.Text>{STATUS[game.won]}</Card.Text>
            </Col>
            <Col xs="auto">
              <Button 
                onClick={() => setExpanded((prev) => !prev)}
                variant="outline-light"
              >
                Dettagli
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Collapse in={expanded}>
      <Card className="bg-black text-white mb-3 text-center">
        <Card.Body>
          <Row>
            <Col>
              <Card.Text className="lead">Carte iniziali</Card.Text>
              <hr />
              {game.rounds
                .filter((round) => round.number === 0)
                .map((round) =>
                  <Card.Text key={round.id} className="lead">
                    {round.card.name}
                  </Card.Text>)}
            </Col>
            {game.rounds
              .filter((round) => round.number !== 0)
              .map((round) => (
                <Col key={round.id}>
                  <Card.Text className="lead">
                    Round {round.number} ({round.won === 1 ? "Vinto" : "Perso"})
                  </Card.Text>
                  <hr />
                  <Card.Text key={round.id} className="lead">{round.card.name}</Card.Text>
                </Col>
              ))}
          </Row>
        </Card.Body>
      </Card>
    </Collapse>
    </>
  );
}

export default Profile;