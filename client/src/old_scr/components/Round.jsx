import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { Button, Container, Col, ProgressBar, Row } from "react-bootstrap";
import { Hand, LoadingSpinner, MisfortuneCard } from "./GameComponents";
import { useTheme } from "../contexts/ThemeContext";
import API from "../API/API.mjs";

function Round({
  handleError,
  setMessage
}) {
  const { darkMode } = useTheme();
  const { gameId, roundId } = useParams();
  const { rounds, getRounds } = useOutletContext();
  const navigate = useNavigate();

  const [ended, setEnded] = useState(false);
  const [selected, setSelected] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [round, setRound] = useState("");

  useEffect(() => {
    const getRound = async () => {
      let round = await API.getRound(gameId, roundId);
      const card = await API.getCard(gameId, roundId);
      round = { ...round, card };
      if (round.won === 1) {
        setMessage({ title: "Congratulazioni!", body: "Hai vinto questo round." });
      } else if (round.won === 0) {
        setMessage({ title: "Peccato!", body: "Hai perso questo round." });
      }
      setRound(round);
      setIsLoading(false);
    };
    handleError(getRound);
  }, [ended]);

  const handleEndGame = () => {
    const endGame = async () => {
      await getRounds();
      await API.updateGame(gameId);
    };
    navigate(`/games/${gameId}`);
    handleError(endGame);
  };

  const handleEndRound = () => {
    const endRound = async () => {
      await API.updateRound(gameId, roundId, selected);
      setEnded(true);
    }
    handleError(endRound);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <h1 className="display-4">Round: {round.number}</h1>
      <p className="lead">Dove vuoi posizionare la carta?</p>
      <Row className="mt-3 mb-5 justify-content-center align-items-center">
        <MisfortuneCard card={round.card} />
      </Row>
      <Row className="mb-5 justify-content-center align-items-center gap-3">
        {round.won !== -1
          ? (
            <Col md="auto">
              <Button
                onClick={handleEndGame}
                variant={darkMode ? "outline-light" : "outline-dark"}
              >
                Avanti
              </Button>
            </Col>
          ) : <Countdown action={handleEndRound} />}
      </Row>
      <Hand
        rounds={rounds}
        selected={selected}
        setSelected={setSelected}
      />
    </>
  );
}

function Countdown({ action }) {
  const TIMEOUT = 30;

  const { darkMode } = useTheme();

  const [time, setTime] = useState(TIMEOUT);

  useEffect(() => {
    if (time > 0) {
      const timerId = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [time]);

  const onClick = () => {
    setTime(0);
    action();
  }

  return (
    <>
      <Col md={6}>
        <ProgressBar
          max={TIMEOUT}
          now={time}
          variant={darkMode ? "light" : "dark"}
          className={darkMode ? "bg-dark" : "bg-light"}
          style={{ height: "3rem" }}
        />
      </Col>
      <Col md="auto">
        <Button
          onClick={onClick}
          variant={darkMode ? "outline-light" : "outline-dark"}
        >
          Conferma
        </Button>
      </Col>
    </>
  )
}

export default Round;