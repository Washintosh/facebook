import "./post.css";
import { MoreVert } from "@material-ui/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePostStart,
  deletePostSuccess,
  deletePostFailure,
} from "../../redux/postsSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { ref, deleteObject } from "firebase/storage";
import storage from "../../firebase";
import { showAlert } from "../../redux/alertSlice";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const { user: currentUser } = useSelector((state) => state.user);
  const { pending } = useSelector((state) => state.posts);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();

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
    dispatch(deletePostStart());
    try {
      const res = await axios.delete(
        `http://localhost:7000/api/posts/${post._id}`,
        {
          headers: {
            token: `Bearer ${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        }
      );
      const { imgName } = res.data.data;
      const fileRef = ref(storage, `/posts/${imgName}`);
      deleteObject(fileRef)
        .then(() => {
          dispatch(deletePostSuccess(post._id));
          dispatch(
            showAlert({ message: "Post successfully deleted", error: false })
          );
        })
        .catch((err) => {
          dispatch(deletePostFailure());
          dispatch(showAlert({ message: err, error: true }));
        });
    } catch (error) {
      console.log(error);
      console.log(JSON.parse(error.request.response).message);
      dispatch(deletePostFailure());
      dispatch(
        showAlert({
          message: JSON.parse(error.request.response).message,
          error: true,
        })
      );
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
              {pending ? (
                <CircularProgress sx={{ color: "white" }} />
              ) : (
                "Modify post"
              )}
            </button>
            <button className="menuBtn" onClick={handleDelete}>
              {pending ? (
                <CircularProgress sx={{ color: "white" }} />
              ) : (
                "Delete post"
              )}
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
            <button onClick={likeHandler} className="heartIcon">
              {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </button>
            <span className="postLikeCounter">
              {isLiked
                ? `You ${
                    like - 1 === 0
                      ? "like it"
                      : like - 1 === 1
                      ? "and 1 person like it"
                      : `and ${like - 1} people like it `
                  }`
                : like === 0
                ? ""
                : like === 1
                ? "1 person likes it"
                : `${like} people like it`}
            </span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
