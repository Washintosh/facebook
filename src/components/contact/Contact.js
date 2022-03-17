import { useNavigate } from "react-router-dom";
import "./contact.css";

export default function Contact({ user }) {
  const navigate = useNavigate();
  return (
    <li className="rightbarFriend" onClick={() => navigate("/messenger")}>
      <div className="rightbarProfileImgContainer">
        <img className="rightbarProfileImg" src={user.profilePicture} alt="" />
        <span className="rightbarOnline"></span>
      </div>
      <span className="rightbarUsername">{user.username}</span>
    </li>
  );
}
