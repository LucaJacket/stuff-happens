import { Button, Row, Col } from "react-bootstrap";
import { useTheme } from "../contexts/ThemeContext";

function Landing({ loggedIn, handleNewGame }) {
  const { darkMode } = useTheme();

  return (
    <>
      <Row className="p-5 justify-content-center align-items-center">
        <Col className="m-5">
          <p className="lead text-center">Benvenuto al</p>
          <h1 className="display-1 text-center">Gioco della Sfortuna</h1>
          <p className="lead text-center">Il gioco che ti farà ridere, imprecare e perdere fiducia nell'universo... tutto in meno di dieci minuti.</p>
          <div className="d-flex flex-column gap-3 align-items-center pt-3">
            <Button
              onClick={handleNewGame}
              variant={darkMode ? "outline-light" : "outline-dark"}
            >
              {!loggedIn ? "Partita demo" : "Nuova partita"}
            </Button>
            <a className={darkMode ? "btn btn-outline-light" : "btn btn-outline-dark"} href="#rules">
              Regole
            </a>
          </div>
        </Col>
      </Row>
      <Row id="rules">
        <Col className="m-5">
          <h1 className="display-6 text-center mb-5">Regole:</h1>
          <ul className="list-unstyled">
            <li>
              <p className="lead">All'inizio, riceverai 3 carte, ognuna delle quali presenterà un nome, un'immagine e un <span className="text-decoration-underline">indice di sfortuna</span>.</p>
            </li>
            <li>
              <p className="lead">Ad ogni nuovo round, ti verrà rivelata 1 carta, senza mostrarti il suo indice di sfortuna: il tuo obiettivo sarà quello di decidere dove mettere la nuova carta tra quelle che hai in mano, in modo che siano <span className="text-decoration-underline">in ordine</span> di indice di sfortuna crescente.</p>
            </li>
            <li>
              <p className="lead">Se indovini, la carta che ti è stata rivelata verrà aggiunta alla tua mano, altrimenti verrà scartata.</p>
            </li>
            <li>
              <p className="lead">Per vincere devi avere un totale di <span className="text-decoration-underline">6 carte</span> in mano. Se commetti <span className="text-decoration-underline">3 errori</span>, hai perso.</p>
            </li>
          </ul>
        </Col>
      </Row>
    </>
  );
}

export default Landing;