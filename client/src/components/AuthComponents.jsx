import { useActionState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router";
import { useTheme } from "../contexts/ThemeContext";

function LoginForm({ handleLogin }) {
  const { darkMode } = useTheme();

  const [state, formAction, isPending] = useActionState(
    async (prevState, formData) => {
      const credentials = {
        username: formData.get("email"),
        password: formData.get("password"),
      };
      return { success: await handleLogin(credentials) };
    },
    { success: null }
  );

  return (
    <Row className="justify-content-center my-5">
      <Col md={4}>
        <Form action={formAction}>
          <h1 className="display-4 mb-3 text-center">Login</h1>
          <Form.Group controlId="email" className="mb-3">
            <Form.Label className="lead">Email</Form.Label>
            <Form.Control type="email" name="email" required />
          </Form.Group>
          <Form.Group controlId="password" className="mb-3">
            <Form.Label className="lead">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              required
              minLength={6}
            />
          </Form.Group>

          {state.success === false && (
            <p className="text-danger text-center">
              Credenziali non valide. Riprova.
            </p>
          )}

          <div className="d-flex flex-column gap-3 align-items-center pt-3">
            <Button
              variant={darkMode ? "outline-light" : "outline-dark"}
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Login in corso..." : "Login"}
            </Button>

            <Link className={darkMode ? "text-light" : "text-dark"} to="/">
              Annulla
            </Link>
          </div>
        </Form>
      </Col>
    </Row>
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
