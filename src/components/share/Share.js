import "./share.css";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@material-ui/icons";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import storage from "../../firebase";
import CircularProgress from "@mui/material/CircularProgress";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  createPostStart,
  createPostSuccess,
  createPostFailure,
} from "../../redux/postsSlice";
import { showAlert } from "../../redux/alertSlice";

export default function Share() {
  const { user } = useSelector((state) => state.user);
  const { pending } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const desc = useRef();
  const [file, setFile] = useState(null);

  const submitHandler = async (e) => {
    dispatch(createPostStart());
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };
    if (file) {
      const filename = new Date().getTime() + file.name;
      const uploadTask = uploadBytesResumable(
        ref(storage, `/posts/${filename}`),
        file
      );
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log(error);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          newPost.imgName = filename;
          newPost.img = url;
          try {
            const res = await axios.post(
              "http://localhost:7000/api/posts",
              newPost,
              {
                headers: {
                  token: `Bearer ${
                    JSON.parse(localStorage.getItem("user")).accessToken
                  }`,
                },
              }
            );
            dispatch(createPostSuccess(res.data.data));
            dispatch(
              showAlert({ message: "Post successfully created", error: false })
            );
          } catch (err) {
            dispatch(createPostFailure());
            dispatch(
              showAlert({
                message: JSON.parse(err.request.response).message,
                error: true,
              })
            );
            console.log("err", err);
            console.log(JSON.parse(err.request.response).message);
          }
          desc.current.value = "";
          setFile(null);
        }
      );
    }
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img className="shareProfileImg" src={user.profilePicture} alt="" />
          <input
            placeholder={"What's in your mind " + user.username + "?"}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button className="shareButton" type="submit">
            {pending ? (
              <CircularProgress size="20px" sx={{ color: "white" }} />
            ) : (
              "Share"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
