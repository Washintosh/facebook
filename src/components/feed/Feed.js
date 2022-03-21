import { useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";
import { useDispatch, useSelector } from "react-redux";
import { fetchFailure, fetchStart, fetchSuccess } from "../../redux/postsSlice";

export default function Feed({ username }) {
  const { user } = useSelector((state) => state.user);
  const { posts, pending } = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPosts = async () => {
      dispatch(fetchStart());
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
        dispatch(
          fetchSuccess(
            res.data.data.sort((p1, p2) => {
              return new Date(p2.createdAt) - new Date(p1.createdAt);
            })
          )
        );
      } catch (err) {
        console.log(JSON.parse(err.request.response).message);
        dispatch(fetchFailure());
      }
    };
    fetchPosts();
  }, [username, user._id]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {posts.length === 0 && <p className="noPosts">No posts to show</p>}
        {(!username || username === user.username) && <Share />}
        {pending && (
          <div className="skeleton">
            <div>
              <Skeleton
                animation="wave"
                variant="circular"
                width={40}
                height={40}
              />
              <Skeleton
                animation="wave"
                variant="text"
                width={200}
                height={30}
              />
            </div>
            <Skeleton animation="wave" variant="text" width={500} height={30} />
            <Skeleton
              variant="rectangular"
              animation="wave"
              width={500}
              height={400}
            />
          </div>
        )}
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
