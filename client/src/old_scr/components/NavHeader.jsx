import { Button, Container, Navbar } from "react-bootstrap";
import { Link } from "react-router";
import { useTheme } from "../contexts/ThemeContext";

function NavHeader({ playing, loggedIn }) {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <Navbar bg="black" data-bs-theme="dark">
      <Container fluid>
        {playing
          ? <span className="navbar-brand">Gioco della Sfortuna</span>
          : <Link to="/" className="navbar-brand">Gioco della Sfortuna</Link>}
        <div className="d-flex gap-3">
          <Button variant="outline-light" onClick={() => toggleDarkMode()}>
            {darkMode ? <i className="bi bi-sun-fill" /> : <i className="bi bi-moon-fill" />}
          </Button>
          {!playing && (loggedIn
            ? <Link to="/profile" className="btn btn-outline-light">Profilo</Link>
            : <Link to="/login" className="btn btn-outline-light">Login</Link>)}
        </div>
      </Container>
    </Navbar>
  );
}

export default NavHeader;