import { Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useTheme } from "../contexts/ThemeContext";
import { addGame, listGames } from "../api/index.mjs";

const NOT_ENDED = 0;

function Home({ loggedIn, setMessage }) {
  const { darkMode } = useTheme();

  const navigate = useNavigate();

  const handleNewGame = () => {
    addGame()
      .then((id) => navigate(`/games/${id}`))
      .catch((err) => setMessage({ title: "Errore", body: err.message }));
  };

  const handleResume = () => {
    listGames()
      .then((games) => {
        const id = games.find((game) => game.outcome === NOT_ENDED).id;
        navigate(`/games/${id}`);
      })
      .catch((err) => setMessage({ title: "Errore", body: err.message }));
  };

  const options = loggedIn
    ? [
        <Button
          onClick={handleNewGame}
          variant={darkMode ? "outline-light" : "outline-dark"}
        >
          Nuova partita
        </Button>,
        <Button
          onClick={handleResume}
          variant={darkMode ? "outline-light" : "outline-dark"}
        >
          Riprendi
        </Button>,
        <a
          href="#rules"
          className={
            darkMode ? "btn btn-outline-light" : "btn btn-outline-dark"
          }
        >
          Regole
        </a>,
      ]
    : [
        <Button
          onClick={handleNewGame}
          variant={darkMode ? "outline-light" : "outline-dark"}
        >
          Nuova partita
        </Button>,
        <a
          href="#rules"
          className={
            darkMode ? "btn btn-outline-light" : "btn btn-outline-dark"
          }
        >
          Regole
        </a>,
      ];

  return (
    <>
      <Row
        className="justify-content-center align-items-center"
        style={{ minHeight: "75vh" }}
      >
        <Col md={6} className="text-center">
          <p className="lead">Benvenuto al</p>
          <h1 className="display-1">Gioco della Sfortuna</h1>
          <p className="lead">
            Il gioco che ti farà ridere, imprecare e perdere fiducia
            nell'universo... tutto in meno di dieci minuti.
          </p>
          <div className="d-flex flex-column align-items-center gap-3 mt-4">
            {...options}
          </div>
        </Col>
      </Row>

      <Row id="rules" className="justify-content-center">
        <Col md={8} className="my-5">
          <h2 className="display-6 text-center mb-5">Regole:</h2>
          <ul className="list-unstyled">
            <li>
              <p className="lead">
                All'inizio, riceverai 3 carte, ognuna delle quali presenterà un
                nome, un'immagine e un{" "}
                <span className="text-decoration-underline">
                  indice di sfortuna
                </span>
                .
              </p>
            </li>
            <li>
              <p className="lead">
                Ad ogni nuovo round, ti verrà rivelata 1 carta, senza mostrarti
                il suo indice di sfortuna: il tuo obiettivo sarà quello di
                decidere dove mettere la nuova carta tra quelle che hai in mano,
                in modo che siano{" "}
                <span className="text-decoration-underline">
                  in ordine crescente
                </span>
                .
              </p>
            </li>
            <li>
              <p className="lead">
                Se indovini, la carta verrà aggiunta alla tua mano, altrimenti
                verrà scartata.
              </p>
            </li>
            <li>
              <p className="lead">
                Per vincere devi avere un totale di{" "}
                <span className="text-decoration-underline">6 carte</span> in
                mano. Se commetti{" "}
                <span className="text-decoration-underline">3 errori</span>, hai
                perso.
              </p>
            </li>
          </ul>
        </Col>
      </Row>
    </>
  );
}

export default Home;
