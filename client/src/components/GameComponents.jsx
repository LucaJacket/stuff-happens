import { useEffect, useState } from "react";
import { Button, Card, Col, ProgressBar, Row } from "react-bootstrap";
import { useTheme } from "../contexts/ThemeContext";

function Countdown({ action, timeout }) {
  const { darkMode } = useTheme();

  const [time, setTime] = useState(timeout);

  useEffect(() => {
    if (time > 0) {
      const handler = setTimeout(() => setTime((prev) => prev - 1), 1000);
      return () => clearTimeout(handler);
    } else action();
  }, [time]);

  return (
    <Row className="justify-content-center align-items-center">
      <Col md={6}>
        <ProgressBar
          max={timeout}
          now={time}
          variant={darkMode ? "light" : "dark"}
          style={{ height: "3rem" }}
        />
      </Col>
      <Col md="auto">
        <Button
          onClick={() => setTime(0)}
          variant={darkMode ? "outline-light" : "outline-dark"}
        >
          Conferma
        </Button>
      </Col>
    </Row>
  );
}

function Lives({ lost, total }) {
  return (
    <Row className="justify-content-center mb-5">
      {Array(total)
        .fill()
        .map((_, i) => (
          <Col key={i} xs="auto">
            <i
              className={
                i < total - lost
                  ? "display-4 bi bi-heart"
                  : "display-4 bi bi-heartbreak"
              }
            />
          </Col>
        ))}
    </Row>
  );
}

function MisfortuneCard({ card }) {
  return (
    <Card
      className={"p-0 text-center"}
      data-bs-theme="light"
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

function SelectButton({ active, setActive }) {
  const { darkMode } = useTheme();

  return (
    <Col xs="auto">
      <Button
        active={active}
        onClick={setActive}
        variant={darkMode ? "outline-light" : "outline-dark"}
        className="rounded-circle"
        style={{ width: "48px", height: "48px" }}
      >
        {active ? (
          <i className="bi bi-check2" />
        ) : (
          <i className="bi bi-plus-lg" />
        )}
      </Button>
    </Col>
  );
}

export { Countdown, Lives, MisfortuneCard, SelectButton };
