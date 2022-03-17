import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import Messenger from "./pages/messenger/Messenger";
import { useSelector } from "react-redux";

function App() {
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
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
    </Router>
  );
}

export default App;
