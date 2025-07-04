import { Fragment } from "react";
import { Button, Card, Col, Container } from "react-bootstrap";
import { useTheme } from "../contexts/ThemeContext";

function Hand({ rounds, selected, setSelected }) {
  const { darkMode } = useTheme();

  const hand = rounds
    .filter((round) => round.won === 1)
    .map((round) => round.card)
    .sort((a, b) => a.misfortune - b.misfortune);

  return (
    <Card className={`overflow-auto p-3 ${darkMode ? "bg-dark" : "bg-light"}`}>
      <div
        className="d-flex flex-row gap-3 align-items-center justify-content-center w-100"
        style={{ minWidth: "max-content" }}
      >
        {selected !== undefined && setSelected !== undefined ? (
          <>
            {hand.map((card, index) => (
              <Fragment key={index}>
                <Space option={index} selected={selected} setSelected={setSelected} />
                <MisfortuneCard key={card.id} card={card} />
              </Fragment>
            ))}
            <Space option={hand.length} selected={selected} setSelected={setSelected} />
          </>
        ) : (
          hand.map((card) => <MisfortuneCard key={card.id} card={card} />)
        )}
      </div>
    </Card>
  );
}

function MisfortuneCard({ card }) {
  return (
    <Card 
      className={`p-0 text-center`} 
      style={{ width: "256px", height: "416px" }}
    >
      <Card.Img variant="top" src={card.image} />
      <Card.Body className="d-flex align-items-center justify-content-center">
        <Card.Text>{card.name}</Card.Text>
      </Card.Body>
      <Card.Footer className="bg-black text-white">
        <Card.Text className="display-6 bg-black text-white">
          {card.misfortune || "?"}
        </Card.Text>
      </Card.Footer>
    </Card>
  );
}

function Space({ option, selected, setSelected }) {
  const { darkMode } = useTheme();

  return (
    <Col xs="auto">
      <Button
        active={selected == option}
        onClick={() => setSelected(option)}
        variant={darkMode ? "outline-light" : "outline-dark"}
        className="rounded-circle"
        style={{ width: "48px", height: "48px" }}
      >
        {selected == option
        ? <i className="bi bi-check2"/>
        : <i className="bi bi-plus-lg"/>}
      </Button>
    </Col>
  );
}

function LoadingSpinner() {
  return (
    <Container fluid className="d-flex justify-content-center p-3 text-center">
      <div className="spinner-border" role="status" />
    </Container>
  );
}

export { MisfortuneCard, Hand, LoadingSpinner };