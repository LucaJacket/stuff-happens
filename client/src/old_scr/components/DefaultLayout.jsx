import { useEffect, useState } from "react";
import { Container, Modal } from "react-bootstrap";
import { Outlet } from "react-router";
import NavHeader from "./NavHeader";
import { useTheme } from "../contexts/ThemeContext";

function DefaultLayout({ loggedIn, message, playing }) {
  const { darkMode } = useTheme();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!!message);
  }, [message]);

  const handleClose = () => setShow(false);

  return (
    <>
      <div className={`d-flex flex-column min-vh-100 
        ${darkMode ? "text-light bg-dark" : "text-dark bg-light"}`}>
        <NavHeader loggedIn={loggedIn} playing={playing} />
        <Container fluid className="flex-grow-1">
          <Modal show={show} onHide={handleClose}>
            <Modal.Header
              closeButton
              closeVariant={darkMode ? "white" : ""}
              className={`rounded-top border-0
                ${darkMode ? "bg-dark text-white" : "bg-light text-dark"}`}
            >
              <Modal.Title>{message.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body 
              className={`rounded-bottom
                ${darkMode ? "bg-dark text-white" : "bg-light text-dark"}`}
            >
              {message.body}
            </Modal.Body>
          </Modal>
          <Outlet />
        </Container>
        <footer>
          <Container fluid className="pt-3 pb-3 bg-black text-white">
            <p className="text-center mb-0">Realizzato da Luca Giacchetta.</p>
          </Container>
        </footer>
      </div>
    </>
  );
}

export default DefaultLayout;