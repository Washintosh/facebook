import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  console.log("user", user);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = username
          ? await axios.get(
              "http://localhost:7000/api/posts/profile/" + username,
              {
                headers: {
                  token: `Bearer ${
                    JSON.parse(localStorage.getItem("user")).accessToken
                  }`,
                },
              }
            )
          : await axios.get("http://localhost:7000/api/posts/timeline", {
              headers: {
                token: `Bearer ${
                  JSON.parse(localStorage.getItem("user")).accessToken
                }`,
              },
            });
        setPosts(
          res.data.data.sort((p1, p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt);
          })
        );
      } catch (err) {
        console.log(JSON.parse(err.request.response).message);
      }
    };
    fetchPosts();
  }, [username, user._id]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) && <Share />}
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
