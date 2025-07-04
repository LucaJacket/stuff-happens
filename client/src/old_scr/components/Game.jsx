import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Hand, LoadingSpinner } from "./GameComponents";
import API from "../API/API.mjs";

function Game({
  loggedIn,
  handleNewGame,
  handleError,
  setMessage,
  setPlaying
}) {
  const { gameId } = useParams();
  const { rounds } = useOutletContext();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [game, setGame] = useState("");

  useEffect(() => {
    const getGame = async () => {
      const game = await API.getGame(gameId);
      if (game.won === 1) {
        setMessage({ title: "Congratulazioni!", body: "Hai vinto questa partita." });
        setPlaying(false);
      } else if (game.won === 0) {
        setMessage({ title: "Peccato!", body: "Hai perso questa partita." });
        setPlaying(false);
      }
      setGame(game);
      setIsLoading(false);
    };
    handleError(getGame);
  }, [rounds]);

  const handleNewRound = () => {
    const newRound = async () => {
      const roundId = await API.addRound(gameId);
      navigate(`/games/${gameId}/rounds/${roundId}`);
    };
    handleError(newRound);
  };

  const MAX_LIVES = loggedIn ? 3 : 1;
  const errors = rounds.filter((round) => round.won === 0).length;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {game.won !== -1
        ? (
          <>
            <h1 className="display-4">Grazie per aver giocato!</h1>
            <p className="lead">Puoi giocare ancora, se vuoi...</p>
          </>
        ) : (
          <>
            <h1 className="display-4">Sei pronto?</h1>
            <p className="lead">Il round inizierà quando rivelerai la prossima carta.</p>
          </>
        )}
      <Row className="mt-3 mb-5 justify-content-center align-items-center">
        <Card
          className="p-0 bg-black justify-content-center align-items-center"
          style={{ width: "256px", height: "416px" }}
        >
          {game.won !== -1
            ? <Button onClick={handleNewGame} variant="outline-light">Gioca ancora</Button>
            : <Button onClick={handleNewRound} variant="outline-light">Rivela</Button>}
        </Card>
      </Row>
      <Row className="mb-5 justify-content-center">
        {Array(MAX_LIVES).fill().map((_, i) =>
          <Col xs="auto" key={i}>
            <i className={
              i < MAX_LIVES - errors
                ? "display-4 bi bi-heart"
                : "display-4 bi bi-heartbreak"
            } />
          </Col>)}
      </Row>
      <Hand rounds={rounds} />
    </>
  );
}

export default Game;