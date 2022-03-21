import axios from "axios";
import { useEffect, useState } from "react";

const useFriends = (user) => {
  const [friends, setFriends] = useState([]);
  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await axios.get(
          `http://localhost:7000/api/users/friends/${user._id}`,
          {
            headers: {
              token: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
              }`,
            },
          }
        );
        setFriends(res.data.data);
      } catch (err) {
        console.log(err);
        console.log(JSON.parse(err.request.response).message);
      }
    };
    user._id && getFriends();
  }, [user]);
  return friends;
};

export default useFriends;
