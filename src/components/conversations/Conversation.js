import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./conversation.css";
import { setChat } from "../../redux/chatSlice";

export default function Conversation({ conversation, currentUser, selected }) {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await axios(
          "http://localhost:7000/api/users?userId=" + friendId,
          {
            headers: {
              token: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
              }`,
            },
          }
        );
        setUser(res.data.data);
      } catch (err) {
        console.log(JSON.parse(err.request.response).message);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  if (selected) {
    dispatch(
      setChat({
        username: user.username,
        profilePicture: user.profilePicture,
      })
    );
  }
  return (
    <div className="conversation">
      <img className="conversationImg" src={user?.profilePicture} alt="" />
      <span className="conversationName">{user?.username}</span>
    </div>
  );
}
