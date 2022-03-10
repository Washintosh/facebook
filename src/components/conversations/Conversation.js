import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

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

  return (
    <div className="conversation">
      <img
        className="conversationImg"
        src={
          user?.profilePicture
            ? PF + user.profilePicture
            : PF + "person/noAvatar.png"
        }
        alt=""
      />
      <span className="conversationName">{user?.username}</span>
    </div>
  );
}
