import { useRef, useEffect, useState } from "react";
import "./login.css";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../../redux/userSlice";
import { Helmet } from "react-helmet";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState({ message: "", show: false });
  const { pending } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleClick = (e) => {
    e.preventDefault();
    dispatch(loginStart());
    const handleLogin = async () => {
      try {
        const res = await axios.post("http://localhost:7000/api/auth/login", {
          email: email.current.value,
          password: password.current.value,
        });
        dispatch(loginSuccess(res.data.data));
      } catch (err) {
        dispatch(loginFailure());
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
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
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
              <button className="loginButton" type="submit" disabled={pending}>
                {pending ? (
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
                {pending ? (
                  <CircularProgress size="20px" sx={{ color: "white" }} />
                ) : (
                  "Create a New Account"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
