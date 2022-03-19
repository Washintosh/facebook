import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { useSelector } from "react-redux";

const Home = lazy(() => import("./pages/home/Home"));
const Login = lazy(() => import("./pages/login/Login"));
const Register = lazy(() => import("./pages/register/Register"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const Messenger = lazy(() => import("./pages/messenger/Messenger"));

function App() {
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <Router>
      <Suspense fallback={<div />}>
        <Routes>
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/messenger"
            element={user ? <Messenger /> : <Navigate to="/" />}
          />
          <Route
            path="/profile/:username"
            element={user ? <Profile /> : <Navigate to="/" />}
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
