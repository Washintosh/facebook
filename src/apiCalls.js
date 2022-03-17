import axios from "axios";

export const getFriends = async (user, setFriends) => {
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
