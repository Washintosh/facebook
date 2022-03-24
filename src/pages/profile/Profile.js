import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import storage from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { Helmet } from "react-helmet";
import { Add, Remove } from "@material-ui/icons";
import { follow, unfollow } from "../../redux/userSlice";
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from "../../redux/userSlice";
import useFriends from "../../hooks/useFriends";

export default function Profile() {
  const { user, pending } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { accessToken } = user;
  const { username } = useParams();
  const [profileUser, setProfileUser] = useState({
    coverPicture: "",
    profilePicture: "",
  });
  const [profilePicture, setProfilePicture] = useState("");
  const [coverPicture, setCoverPicture] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    success: true,
  });
  const [upload, setUpload] = useState({});
  useEffect(() => {
    setUpload({});
    setProfilePicture("");
    setCoverPicture("");
    const fetchUser = async () => {
      const res = await axios.get(
        `http://localhost:7000/api/users?username=${username}`,
        {
          headers: {
            token: `Bearer ${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        }
      );
      setProfileUser(res.data.data);
    };
    fetchUser();
  }, [username, user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(updateStart());
    const updateUser = async (body) => {
      try {
        const res = await axios.put(
          `http://localhost:7000/api/users/${user._id}`,
          body,
          {
            headers: {
              token:
                "Bearer " +
                JSON.parse(localStorage.getItem("user")).accessToken,
            },
          }
        );
        const {
          password: {},
          ...updatedUser
        } = res.data.data;
        dispatch(updateSuccess({ ...updatedUser, accessToken }));
        setAlert({
          show: true,
          message: "The user was successfully updated",
          success: true,
        });
      } catch (error) {
        console.log("error", error);
        setAlert({
          show: true,
          message: JSON.parse(error.request.response).message,
          success: false,
        });
        dispatch(updateFailure());
      }
    };
    if (upload.file) {
      const filename = new Date().getTime() + upload.file.name;
      const uploadTask = uploadBytesResumable(
        ref(storage, `/profile/${filename}`),
        upload.file
      );
      try {
        const url = await new Promise((res, rej) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
            },
            (error) => {
              rej(error);
            },
            async () => {
              res(await getDownloadURL(uploadTask.snapshot.ref));
            }
          );
        });
        await updateUser({ [upload.name]: url });
        setUpload({});
        setCoverPicture("");
        setProfilePicture("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (alert.show) {
      const timeout = setTimeout(
        () => setAlert((prev) => ({ ...prev, show: false })),
        4500
      );
      return () => clearTimeout(timeout);
    }
  }, [alert.show]);

  const [followed, setFollowed] = useState(false);
  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(
          `http://localhost:7000/api/users/${profileUser._id}/unfollow`,
          {
            userId: user._id,
          },
          {
            headers: {
              token: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
              }`,
            },
          }
        );
        dispatch(unfollow(profileUser._id));
      } else {
        await axios.put(
          `http://localhost:7000/api/users/${profileUser._id}/follow`,
          {
            userId: user._id,
          },
          {
            headers: {
              token: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
              }`,
            },
          }
        );
        dispatch(follow(profileUser._id));
      }
      setFollowed(!followed);
    } catch (err) {}
  };
  useEffect(() => {
    setFollowed(user.followings.includes(profileUser?._id));
  }, [profileUser]);

  const friends = useFriends(profileUser);
  return (
    <>
      <Helmet>
        <title>{`${username} profile`}</title>
      </Helmet>
      <Topbar />
      <div className="profile">
        <div
          className={`${
            alert.show
              ? alert.success
                ? "alert show success"
                : "alert show error"
              : alert.success
              ? "alert success"
              : "alert error"
          }`}
        >
          {alert.message}
        </div>
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={
                  profileUser &&
                  (coverPicture
                    ? URL.createObjectURL(coverPicture)
                    : profileUser.coverPicture)
                }
                alt=""
              />
              {profileUser._id === user._id && (
                <form className="coverImgContainer" onSubmit={submitHandler}>
                  <label htmlFor="coverImg" className="changeCoverImg">
                    <span className="shareOptionText">Change cover image</span>
                    <input
                      style={{ display: "none" }}
                      type="file"
                      id="coverImg"
                      name="coverPicture"
                      accept=".png,.jpeg,.jpg"
                      onChange={(e) => {
                        setUpload({
                          name: e.target.name,
                          file: e.target.files[0],
                        });
                        setCoverPicture(e.target.files[0]);
                      }}
                    />
                  </label>
                  {upload.name === "coverPicture" && (
                    <button>
                      {pending ? (
                        <CircularProgress size="20px" sx={{ color: "white" }} />
                      ) : (
                        "UPDATE"
                      )}
                    </button>
                  )}
                </form>
              )}
              <img
                className="profileUserImg"
                src={
                  profileUser &&
                  (profilePicture
                    ? URL.createObjectURL(profilePicture)
                    : profileUser.profilePicture)
                }
                alt=""
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{profileUser.username}</h4>
              <span className="profileInfoDesc">{profileUser.desc}</span>
              <form onSubmit={submitHandler} className="changeImgForm">
                {profileUser._id === user._id && (
                  <>
                    <label htmlFor="profileImg" className="changeImg">
                      <span className="shareOptionText">
                        Change profile image
                      </span>
                      <input
                        style={{ display: "none" }}
                        type="file"
                        id="profileImg"
                        name="profilePicture"
                        accept=".png,.jpeg,.jpg"
                        onChange={(e) => {
                          setUpload({
                            name: e.target.name,
                            file: e.target.files[0],
                          });
                          setProfilePicture(e.target.files[0]);
                        }}
                      />
                    </label>
                    {upload.name === "profilePicture" && (
                      <button>
                        {pending ? (
                          <CircularProgress
                            size="20px"
                            sx={{ color: "white" }}
                          />
                        ) : (
                          "UPDATE"
                        )}
                      </button>
                    )}
                  </>
                )}
              </form>
            </div>
          </div>
          <div className="middleProfile">
            {profileUser.username !== user.username && (
              <button className="followButton" onClick={handleClick}>
                {followed ? "Unfollow" : "Follow"}
                {followed ? <Remove /> : <Add />}
              </button>
            )}
            <section className="friendsContainer">
              <h4 className="sectionTitle">Friends</h4>
              <div className="followingList">
                {friends.map((friend) => (
                  <Link
                    key={friend._id}
                    to={"/profile/" + friend.username}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="following">
                      <img
                        src={friend.profilePicture}
                        alt=""
                        className="followingImg"
                      />
                      <span className="followingName">{friend.username}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
          <section className="postsContainer">
            <h4 className="sectionTitle">Posts</h4>
            <Feed username={username} />
          </section>
        </div>
      </div>
    </>
  );
}
