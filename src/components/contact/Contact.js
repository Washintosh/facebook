import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./contact.css";
import { openClose } from "../../redux/sidebarSlice";

export default function Contact({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <li
      className="rightbarFriend"
      onClick={() => {
        navigate("/messenger");
        dispatch(openClose(false));
      }}
    >
      <div className="rightbarProfileImgContainer">
        <img className="rightbarProfileImg" src={user.profilePicture} alt="" />
        <span className="rightbarOnline"></span>
      </div>
      <span className="rightbarUsername">{user.username}</span>
    </li>
  );
}
