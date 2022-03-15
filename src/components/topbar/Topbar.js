import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { IoLogOutOutline } from "react-icons/io5";
import { FaBars } from "react-icons/fa";

export default function Topbar() {
  const navigate = useNavigate();
  const { user, dispatch, setIsSidebarOpen, isSidebarOpen } =
    useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
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
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarIcons">
          <div
            className="faBars"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FaBars />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div
            className="topbarIconItem"
            onClick={() => navigate("/messenger")}
          >
            <Chat />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <Link to={`/profile/${user?.username}`}>
          <img
            src={
              user.profilePicture
                ? PF + user?.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
        <button onClick={() => dispatch({ type: "LOGOUT" })} className="logout">
          <IoLogOutOutline />
        </button>
      </div>
    </div>
  );
}
