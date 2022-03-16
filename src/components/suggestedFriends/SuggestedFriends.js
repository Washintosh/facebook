import "./suggestedFriends.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SuggestedFriends = () => {
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const navigate = useNavigate();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  useEffect(() => {
    const getSuggestedFriends = async () => {
      try {
        const res = await axios.get(
          "http://localhost:7000/api/users/suggested",
          {
            headers: {
              token: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
              }`,
            },
          }
        );
        setSuggestedFriends(res.data.data);
      } catch (err) {
        console.log(JSON.parse(err.request.response).message);
      }
    };
    getSuggestedFriends();
  }, []);
  return (
    <div className="container">
      <h4>Suggested Friends</h4>
      {suggestedFriends.map((suggestion) => (
        <div
          className="suggestion"
          key={suggestion._id}
          onClick={() => navigate(`/profile/${suggestion.username}`)}
        >
          <div className="suggestionImgContainer">
            <img
              src={suggestion.profilePicture}
              alt=""
              className="suggestionImg"
            />
          </div>
          {suggestion.username}
        </div>
      ))}
    </div>
  );
};

export default SuggestedFriends;
