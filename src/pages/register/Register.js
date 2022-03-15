import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import "./register.css";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const navigate = useNavigate();
  const { isFetching, dispatch } = useContext(AuthContext);
  const [error, setError] = useState({ message: "", show: false });

  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      dispatch({ type: "REGISTER_START" });
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post("http://localhost:7000/api/auth/register", user);
        const res = await axios.post("http://localhost:7000/api/auth/login", {
          email: email.current.value,
          password: password.current.value,
        });
        dispatch({ type: "REGISTER_SUCCESS", payload: res.data.data });
        navigate("/");
      } catch (err) {
        dispatch({ type: "REGISTER_FAILURE" });
        setError({
          message: JSON.parse(err.request.response).message,
          show: true,
        });
      }
    }
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
              placeholder="Username"
              required
              ref={username}
              className="loginInput"
            />
            <input
              placeholder="Email"
              required
              ref={email}
              className="loginInput"
              type="email"
            />
            <input
              placeholder="Password"
              required
              ref={password}
              className="loginInput"
              type="password"
              minLength="6"
            />
            <input
              placeholder="Password Again"
              required
              ref={passwordAgain}
              className="loginInput"
              type="password"
            />
            <button className="signUp" type="submit" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress sx={{ color: "white" }} />
              ) : (
                "Sign up"
              )}
            </button>
            <button
              className="logIn"
              onClick={() => navigate("/")}
              disabled={isFetching}
            >
              Log into Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
