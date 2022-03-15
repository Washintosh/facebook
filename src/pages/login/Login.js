import { useContext, useRef, useEffect, useState } from "react";
import "./login.css";
import { AuthContext } from "../../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();
  const { isFetching, dispatch } = useContext(AuthContext);
  const [error, setError] = useState({ message: "", show: false });

  const handleClick = (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    const handleLogin = async () => {
      try {
        const res = await axios.post("http://localhost:7000/api/auth/login", {
          email: email.current.value,
          password: password.current.value,
        });
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.data });
      } catch (err) {
        dispatch({ type: "LOGIN_FAILURE" });
        setError({
          message: JSON.parse(err.request.response).message,
          show: true,
        });
      }
    };
    handleLogin();
  };

  useEffect(() => {
    if (error.show) {
      const timeout = setTimeout(() => {
        setError({ ...error, show: false });
      }, 4500);
      return () => clearTimeout(timeout);
    }
  }, [error.show]);

  return (
    <div className="login">
      <div className={`errorMessage ${error.show ? "show" : ""}`}>
        {error.message}
      </div>
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">facebook</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on facebook.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Email"
              type="email"
              required
              className="loginInput"
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              required
              minLength="6"
              className="loginInput"
              ref={password}
            />
            <button className="loginButton" type="submit" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress size="20px" sx={{ color: "white" }} />
              ) : (
                "Log In"
              )}
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <button
              className="loginRegisterButton"
              onClick={() => navigate("/register")}
            >
              {isFetching ? (
                <CircularProgress size="20px" sx={{ color: "white" }} />
              ) : (
                "Create a New Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
