import "./sidebar.css";
import {
  RssFeed,
  Chat,
  PlayCircleFilledOutlined,
  Group,
  Bookmark,
  HelpOutline,
  WorkOutline,
  Event,
  School,
} from "@material-ui/icons";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { BsMessenger } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFriends } from "../../apiCalls";
import Contact from "../contact/Contact";
import { useDispatch, useSelector } from "react-redux";
import { openClose } from "../../redux/sidebarSlice";

export default function Sidebar() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const { user } = useSelector((state) => state.user);
  const { sidebar } = useSelector((state) => state.sidebar);
  const dispatch = useDispatch();

  useEffect(() => {
    getFriends(user, setFriends);
  }, []);

  return (
    <div className={`sidebar ${sidebar ? "show" : ""}`}>
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <RssFeed className="sidebarIcon" />
            <span className="sidebarListItemText">Feed</span>
          </li>
          <li
            className="sidebarListItem"
            onClick={() => {
              navigate("/messenger");
              dispatch(openClose(false));
            }}
          >
            <BsMessenger className="sidebarIcon" />
            <span className="sidebarListItemText">Messenger</span>
          </li>
          <li className="sidebarListItem">
            <PlayCircleFilledOutlined className="sidebarIcon" />
            <span className="sidebarListItemText">Videos</span>
          </li>
          <li className="sidebarListItem">
            <Group className="sidebarIcon" />
            <span className="sidebarListItemText">Groups</span>
          </li>
          <li className="sidebarListItem">
            <Bookmark className="sidebarIcon" />
            <span className="sidebarListItemText">Bookmarks</span>
          </li>
          <li className="sidebarListItem">
            <HelpOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Questions</span>
          </li>
          <li className="sidebarListItem">
            <WorkOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Jobs</span>
          </li>
          <li className="sidebarListItem">
            <Event className="sidebarIcon" />
            <span className="sidebarListItemText">Events</span>
          </li>
          <li className="sidebarListItem">
            <School className="sidebarIcon" />
            <span className="sidebarListItemText">Courses</span>
          </li>
          <h4 className="rightbarTitle">Contacts</h4>
          <ul className="rightbarFriendList">
            {friends.map((u) => (
              <Contact key={u._id} user={u} />
            ))}
          </ul>
        </ul>
      </div>
    </div>
  );
}
