import { useEffect, useState } from "react";
import { Button, Card, Col, Row, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import { useTheme } from "../contexts/ThemeContext";
import {
  Countdown,
  Lives,
  MisfortuneCard,
  SelectButton,
} from "../components/GameComponents";
import { addGame, addRound, getGame, updateGame } from "../api/index.mjs";

const GAME = {
  win: 6,
  lose: 3,
};
const DEMO_GAME = {
  win: 4,
  lose: 1,
};
const TIMEOUT = 30;
const NOT_ENDED = 0;
const LOST = 1;
const WON = 2;

function Game({ loggedIn, setMessage }) {
  const { darkMode } = useTheme();

  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState(null);
  const [index, setIndex] = useState(-1);

  const load = () => {
    setLoading(true);
    setIndex(-1);
    getGame(id)
      .then(setGame)
      .catch((err) => setMessage({ title: "Errore", body: err.message }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading)
    return (
      <Row className="justify-content-center my-5">
        <Spinner animation="border" />
      </Row>
    );

  const handleNewGame = () => {
    addGame()
      .then((id) => navigate(`/games/${id}`))
      .catch((err) => setMessage({ title: "Errore", body: err.message }));
  };

  const handleNewRound = () => {
    addRound(id)
      .catch((err) => setMessage({ title: "Errore", body: err.message }))
      .finally(load);
  };

  const currentRound = game.rounds.find((round) => round.outcome === NOT_ENDED);

  let header;
  if (game.outcome !== NOT_ENDED)
    header = (
      <Row className="justify-content-center my-5">
        <Col md={6} className="text-center">
          <h1 className="display-4">Grazie per aver giocato!</h1>
          <p className="lead">Puoi giocare ancora, se vuoi...</p>
          <div>
            <Button
              onClick={handleNewGame}
              variant={darkMode ? "outline-light" : "outline-dark"}
            >
              Gioca ancora
            </Button>
          </div>
        </Col>
      </Row>
    );
  else if (currentRound)
    header = (
      <Row className="justify-content-center my-5">
        <Col md={6} className="d-flex flex-column align-items-center">
          <h1 className="display-4">Round: {currentRound.number}</h1>
          <p className="lead">Dove vuoi inserire questa carta?</p>
          <MisfortuneCard card={currentRound.card} />
        </Col>
      </Row>
    );
  else
    header = (
      <Row className="justify-content-center my-5">
        <Col md={6} className="d-flex flex-column align-items-center">
          <h1 className="display-4">Sei pronto?</h1>
          <p className="lead">
            Il round inizierà quando rivelerai la prossima carta.
          </p>
          <Card
            className="p-0 bg-black justify-content-center align-items-center"
            style={{ width: "256px", height: "416px" }}
          >
            <Button onClick={handleNewRound} variant="outline-light">
              Rivela
            </Button>
          </Card>
        </Col>
      </Row>
    );

  const hand = game.rounds
    .filter((round) => round.outcome === WON)
    .map((round) => round.card)
    .sort((a, b) => a.misfortune - b.misfortune);

  let content;
  if (currentRound)
    content = (
      <>
        {hand.flatMap((card, i) => [
          <SelectButton
            key={hand.length + i}
            active={index === i}
            setActive={() => setIndex(i)}
          />,
          <MisfortuneCard key={i} card={card} />,
        ])}
        <SelectButton
          active={index === hand.length}
          setActive={() => setIndex(hand.length)}
        />
      </>
    );
  else
    content = (
      <>
        {hand.map((card, i) => (
          <MisfortuneCard key={i} card={card} />
        ))}
      </>
    );

  const config = loggedIn ? GAME : DEMO_GAME;
  const lost = game.rounds.filter((round) => round.outcome === LOST).length;

  const handleEndRound = () => {
    updateGame(id, index)
      .then((outcome) => {
        if (outcome === WON) {
          const won =
            game.rounds.filter((round) => round.outcome === WON).length + 1;
          if (won === config.win)
            setMessage({
              title: "Congratulazioni!",
              body: "Hai vinto questa partita!",
            });
          else
            setMessage({
              title: "Congratulazioni!",
              body: "Hai vinto questo round!",
            });
        } else if (outcome === LOST) {
          const lost =
            game.rounds.filter((round) => round.outcome === LOST).length + 1;
          if (lost === config.lose)
            setMessage({
              title: "Peccato...",
              body: "Hai perso questa partita.",
            });
          else
            setMessage({
              title: "Peccato...",
              body: "Hai perso questo round.",
            });
        }
      })
      .catch((err) => setMessage({ title: "Errore", body: err.message }))
      .finally(load);
  };

  return (
    <>
      {header}
      <Lives lost={lost} total={config.lose}></Lives>
      {currentRound && <Countdown action={handleEndRound} timeout={TIMEOUT} />}
      <Row className="justify-content-center m-5">
        <Card className="overflow-auto py-3">
          <div
            className="d-flex flex-row gap-3 align-items-center justify-content-center w-100"
            style={{ minWidth: "max-content" }}
          >
            {content}
          </div>
        </Card>
      </Row>
    </>
  );
}

export default Game;
