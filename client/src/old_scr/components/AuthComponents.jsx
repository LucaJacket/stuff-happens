import { useActionState } from "react";
import { Form, Button, Container, Col } from "react-bootstrap";
import { Link } from "react-router";
import { useTheme } from "../contexts/ThemeContext";

function LoginForm({ handleLogin }) {
  const { darkMode } = useTheme();

  const [state, formAction, isPending] = useActionState(async (prevState, formData) => {
    const credentials = {
      username: formData.get("email"),
      password: formData.get("password"),
    };
    return { success: await handleLogin(credentials) };
  }, "");

  return (
    <Container fluid className="d-flex flex-column p-3 align-items-center">
      <Col md={4}>
        <Form action={formAction}>
          <h1 className="display-4 mb-3 text-center">Login</h1>
          <Form.Group controlId="email" className="mb-3">
            <Form.Label className="lead">Email</Form.Label>
            <Form.Control
              className="bg-black text-white" 
              type="email" 
              name="email" 
              required
            />
          </Form.Group>
          <Form.Group controlId="password" className="mb-3">
            <Form.Label className="lead">Password</Form.Label>
            <Form.Control 
              className="bg-black text-white"  
              type="password" 
              name="password" 
              required minLength={5} 
            />
          </Form.Group>
          <div className="d-flex flex-column gap-3 align-items-center pt-3">
            <Button
              variant={darkMode ? "outline-light" : "outline-dark"}
              type="submit"
              disabled={isPending}
            >
              Login
            </Button>
            <Link className={darkMode ? "text-light" : "text-dark"} to="/">Annulla</Link>
          </div>
        </Form>
      </Col>
    </Container>
  );
}

function LogoutButton({ handleLogout }) {
  const { darkMode } = useTheme();

  return (
    <Button
      variant={darkMode ? "outline-light" : "outline-dark"}
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}

export { LoginForm, LogoutButton };