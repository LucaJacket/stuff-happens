import { Container } from "react-bootstrap";

function NotFound() {
  return (
    <Container fluid className="d-flex flex-column align-items-center p-3 text-center">
      <h1 className="display-4">Errore 404</h1>
      <p className="lead">La risorsa che stai cercando non esiste...</p>
    </Container>
  );
}

export default NotFound;