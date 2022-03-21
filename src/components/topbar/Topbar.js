import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import { FaBars } from "react-icons/fa";
import { logout } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { openClose } from "../../redux/sidebarSlice";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Topbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { sidebar } = useSelector((state) => state.sidebar);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const res = await axios.get(
          `http://localhost:7000/api/users/search?username=${search}`,
          {
            headers: {
              token: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
              }`,
            },
          }
        );
        setResults(res.data.data);
      } catch (err) {
        console.log(err);
        console.log(JSON.parse(err.request.response).message);
        setResults([]);
      }
    };
    fetchPeople();
  }, [search]);
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">facebook</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>
      {search && (
        <div className="searchResults">
          {results.length !== 0 ? (
            results.map((result) => (
              <div
                key={result._id}
                className="result"
                onClick={() => {
                  navigate(`/profile/${result.username}`);
                  dispatch(openClose(false));
                  setSearch("");
                }}
              >
                <img src={result.profilePicture} alt="search" />
                <p>{result.username}</p>
              </div>
            ))
          ) : (
            <div className="noResults">No matches found</div>
          )}
        </div>
      )}
      <div className="topbarRight">
        <div className="faBars" onClick={() => dispatch(openClose(!sidebar))}>
          <FaBars />
          <span className="topbarIconBadge">1</span>
        </div>
        <div className="topbarIconItem">
          <Person />
          <span className="topbarIconBadge">1</span>
        </div>
        <div className="topbarIconItem" onClick={() => navigate("/messenger")}>
          <Chat />
          <span className="topbarIconBadge">2</span>
        </div>
        <div className="topbarIconItem">
          <Notifications />
          <span className="topbarIconBadge">1</span>
        </div>
        <Link
          to={`/profile/${user?.username}`}
          className="topbarImg"
          onClick={() => {
            dispatch(openClose(false));
          }}
        >
          <img src={user.profilePicture} alt="" />
          <p>{user.username}</p>
        </Link>
        <button
          onClick={() => {
            dispatch(logout());
            dispatch(openClose(false));
          }}
          className="logout"
        >
          <IoLogOutOutline />
        </button>
      </div>
    </div>
  );
}
