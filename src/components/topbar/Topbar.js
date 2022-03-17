import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import { FaBars } from "react-icons/fa";
import { logout } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { openClose } from "../../redux/sidebarSlice";

export default function Topbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
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
        <div className="faBars" onClick={() => dispatch(openClose())}>
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
        <Link to={`/profile/${user?.username}`} className="topbarImg">
          <img src={user.profilePicture} alt="" />
          <p>{user.username}</p>
        </Link>
        <button onClick={() => dispatch(logout())} className="logout">
          <IoLogOutOutline />
        </button>
      </div>
    </div>
  );
}
