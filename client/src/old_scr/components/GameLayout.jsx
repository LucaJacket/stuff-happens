import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router";
import { Container } from "react-bootstrap";
import API from "../API/API.mjs";

function GameLayout({ handleError }) {
  const { gameId } = useParams();

  const [rounds, setRounds] = useState([]);

  const getRounds = async () => {
    let rounds = await API.getRounds(gameId);
    rounds = await Promise.all(
      rounds.map(async (round) => {
        const card = await API.getCard(gameId, round.id);
        return { ...round, card };
      })
    );
    setRounds(rounds);
  }

  useEffect(() => {
    handleError(getRounds);
  }, [gameId]);

  return (
    <Container fluid className="d-flex flex-column p-3 text-center">
      <Outlet context={{ rounds, getRounds }} />
    </Container>
  );
}

export default GameLayout;