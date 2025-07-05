import dayjs from "dayjs";
import "dayjs/locale/it";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useState } from "react";
import { Button, Card, Col, Collapse, Row } from "react-bootstrap";
import { MisfortuneCard } from "./GameComponents";

dayjs.extend(localizedFormat);
dayjs.locale("it");

const GAME_OUTCOME = {
  0: "Non terminata",
  1: "Sconfitta",
  2: "Vittoria",
};
const ROUND_OUTCOME = {
  0: "Non terminato",
  1: "Perso",
  2: "Vinto",
};
const WON = 2;

function History({ games }) {
  return (
    <Col className="text-center">
      <h1 className="display-4 mb-3">Cronologia</h1>
      {games.length === 0 ? (
        <p className="lead">Non hai ancora giocato nessuna partita.</p>
      ) : (
        games.map((game, index) => <HistoryRow key={index} game={game} />)
      )}
    </Col>
  );
}

function HistoryRow({ game }) {
  const [expanded, setExpanded] = useState(false);

  const played = game.rounds.filter((round) => round.number !== 0);
  const initial = game.rounds.filter((round) => round.number === 0);
  const won = played.filter((round) => round.outcome === WON);

  return (
    <>
      <Card className="bg-black text-white text-center mb-3">
        <Card.Body>
          <Row className="align-items-center">
            <Col>
              <Card.Text className="lead">Data</Card.Text>
              <Card.Text>{game.createdAt.format("LLLL")}</Card.Text>
            </Col>
            <Col>
              <Card.Text className="lead">Round giocati</Card.Text>
              <Card.Text>{played.length}</Card.Text>
            </Col>
            <Col>
              <Card.Text className="lead">Carte raccolte</Card.Text>
              <Card.Text>{won.length}</Card.Text>
            </Col>
            <Col>
              <Card.Text className="lead">Esito</Card.Text>
              <Card.Text>{GAME_OUTCOME[game.outcome]}</Card.Text>
            </Col>
            <Col md={1}>
              <Button
                onClick={() => setExpanded((prev) => !prev)}
                variant="outline-light"
              >
                {expanded ? (
                  <i className="bi bi-zoom-out" />
                ) : (
                  <i className="bi bi-zoom-in" />
                )}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Collapse in={expanded}>
        <Card className="mb-3 p-3 text-center">
          <Card.Body>
            <Row className="mb-5">
              <Card.Text className="lead">Carte iniziali</Card.Text>
              <Row className="justify-content-center d-flex gap-3">
                {initial
                  .sort((a, b) => a.card.misfortune - b.card.misfortune)
                  .map((round, index) => (
                    <MisfortuneCard key={index} card={round.card} />
                  ))}
              </Row>
            </Row>

            <Row className="justify-content-center d-flex gap-3">
              {played.map((round, index) => (
                <Col
                  key={index}
                  className="d-flex flex-column align-items-center"
                  xs="auto"
                >
                  <Card.Text className="lead">
                    Round {round.number} ({ROUND_OUTCOME[round.outcome]})
                  </Card.Text>
                  <MisfortuneCard card={round.card} />
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Collapse>
    </>
  );
}

export default History;
