import { useEffect, useState } from "react";
import { Button, Container, Modal, Navbar } from "react-bootstrap";
import { Link, Outlet } from "react-router";
import { useTheme } from "../contexts/ThemeContext";

function DefaultLayout({ loggedIn, message }) {
  const { darkMode, toggleDarkMode } = useTheme();

  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!!message);
  }, [message]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar bg="black" variant="dark">
        <Container
          fluid
          className="py-1 d-flex justify-content-between align-items-center"
        >
          <Link to="/" className="navbar-brand">
            Gioco della Sfortuna
          </Link>
          <div className="d-flex gap-3">
            <Button variant="outline-light" onClick={toggleDarkMode}>
              {darkMode ? (
                <i className="bi bi-sun-fill" />
              ) : (
                <i className="bi bi-moon-fill" />
              )}
            </Button>
            {loggedIn ? (
              <Link to="/profile" className="btn btn-outline-light">
                Profilo
              </Link>
            ) : (
              <Link to="/login" className="btn btn-outline-light">
                Login
              </Link>
            )}
          </div>
        </Container>
      </Navbar>

      <Container fluid className="flex-grow-1 py-3">
        <Outlet />
      </Container>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        aria-labelledby="modal-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="modal-title">{message?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message?.body}</Modal.Body>
      </Modal>

      <footer>
        <Container fluid className="bg-black text-white py-3">
          <p className="text-center mb-0">Realizzato da Luca Giacchetta.</p>
        </Container>
      </footer>
    </div>
  );
}

export default DefaultLayout;
