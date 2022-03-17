import "./post.css";
import { MoreVert } from "@material-ui/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const { user: currentUser } = useSelector((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `http://localhost:7000/api/users?userId=${post.userId}`,
        {
          headers: {
            token: `Bearer ${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        }
      );
      setUser(res.data.data);
    };
    fetchUser();
  }, [post.userId]);

  const handleDelete = async (e) => {
    try {
      await axios.delete(`http://localhost:7000/api/posts/${post._id}`, {
        headers: {
          token: `Bearer ${
            JSON.parse(localStorage.getItem("user")).accessToken
          }`,
        },
      });
    } catch (error) {
      console.log(error);
      console.log(JSON.parse(error.request.response).message);
    }
  };

  const likeHandler = () => {
    try {
      axios.put(
        "http://localhost:7000/api/posts/" + post._id + "/like",
        {
          userId: currentUser._id,
        },
        {
          headers: {
            token: `Bearer ${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        }
      );
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };
  return (
    <div className="post">
      <div className="postWrapper">
        {currentUser._id === post.userId && (
          <div className={`${isMenuOpen ? "show" : ""} menu`}>
            <button className="menuBtn" onClick={handleDelete}>
              Delete post
            </button>
          </div>
        )}
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={user.profilePicture}
                alt=""
              />
              <span className="postUsername">{user.username}</span>
            </Link>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div
            className="postTopRight"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`https://firebasestorage.googleapis.com/v0/b/facebook-dc21a.appspot.com/o/public%2Flike.png?alt=media&token=2bdaea58-f4e6-4476-b1f9-72ccda9ddc95`}
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src={`https://firebasestorage.googleapis.com/v0/b/facebook-dc21a.appspot.com/o/public%2Fheart.png?alt=media&token=2fe5af6b-ba62-463f-b8d4-3a9bc6642bf2`}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
