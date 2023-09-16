import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import { Button, Container, FloatingLabel, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios, { AxiosError } from "axios";

export const Signup = () => {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/dashboard");
    }
  }, []);

  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      console.log(email, password);
      signup(email, password);
    }
    setValidated(true);
  };

  const signup = async (email: string, password: string) => {
    const toastId = toast.loading("Creating account..");
    try {
      const response = await axios.post("http://localhost:3000/signup", {
        email,
        password,
      });
      if (response.status === 200 || response.status === 201) {
        toast.success("Account created sucessfully", { id: toastId });
        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        if (!err?.response) {
          toast.error(err.message, { id: toastId });
        } else {
          toast.error(err.message, { id: toastId });
        }
      }
    }
  };
  return (
    <Container
      fluid="xs"
      className={`d-flex align-items-center rounded bg-light border ${style.login}`}
      style={{}}
    >
      <Toaster />
      <div className={`m-3 ${style.logindiv} ${style.magicpattern}`}>
        <Form
          style={{ zIndex: 2, position: "inherit" }}
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <h3
            className="p-3 d-flex justify-content-center"
            style={{ position: "sticky", zIndex: 1, fontWeight: "bolder" }}
          >
            SIGNUP
          </h3>
          <FloatingLabel
            className="m-3"
            controlId="floatingInput"
            label="Email address"
          >
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com"
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Email.
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel
            className="m-3"
            controlId="floatingPassword"
            label="password"
          >
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </FloatingLabel>
          <FloatingLabel
            className="m-3"
            controlId="floatingRePassword"
            label="Retype Password"
          >
            <Form.Control
              type="password"
              value={repassword}
              onChange={(e) => setRepassword(e.target.value)}
              required
              placeholder="RePassword"
              isInvalid={!(password === repassword)}
            />
            <Form.Control.Feedback type="invalid">
              Password doesn't match.
            </Form.Control.Feedback>
          </FloatingLabel>
          <div
            className="m-3"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Button
              className={`${style.btm}`}
              style={{
                zIndex: 1,
                position: "sticky",
                backgroundColor: "#6c63ff",
              }}
              type="submit"
            >
              Submit form
            </Button>
          </div>
          <div
            className="m-3"
            style={{ display: "flex", justifyContent: "end" }}
          >
            <Link to="/login" style={{ paddingRight: "30px" }}>
              Already have an account?
            </Link>
          </div>
        </Form>
      </div>
    </Container>
  );
};
