import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import storage from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from "../../redux/userSlice";

export default function Profile() {
  const { user, pending } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { accessToken } = user;
  const { username } = useParams();
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);
  const [coverPicture, setCoverPicture] = useState(user.coverPicture);
  const [profileUser, setProfileUser] = useState({});
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    success: true,
  });

  console.log("profilePicture", profilePicture);
  console.log("coverPicture", coverPicture);
  useEffect(() => {
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
  }, [username]);

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
    if (profilePicture) {
      const filename = new Date().getTime() + profilePicture.name;
      const uploadTask = uploadBytesResumable(
        ref(storage, `/profile/${filename}`),
        profilePicture
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
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            updateUser({ profilePicture: url });
          });
        }
      );
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
  return (
    <>
      <Topbar />
      <div className="profile">
        <button
          className="test"
          onClick={() =>
            setAlert({
              show: true,
              message: "The user was successfully updated",
              success: true,
            })
          }
        >
          TEST
        </button>
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
              {profileUser._id === user._id && (
                <div className="coverImgContainer">
                  <label htmlFor="file" className="changeCoverImg">
                    <span className="shareOptionText">Change cover image</span>
                    <input
                      style={{ display: "none" }}
                      type="file"
                      id="file"
                      accept=".png,.jpeg,.jpg"
                      onChange={(e) => setCoverPicture(e.target.files[0])}
                    />
                  </label>
                  {coverPicture !== user.coverPicture && (
                    <button>
                      {pending ? (
                        <CircularProgress size="20px" sx={{ color: "white" }} />
                      ) : (
                        "UPDATE"
                      )}
                    </button>
                  )}
                </div>
              )}
              <img
                className="profileCoverImg"
                src={
                  user._id === profileUser._id
                    ? coverPicture === user.coverPicture
                      ? coverPicture
                      : URL.createObjectURL(coverPicture)
                    : profileUser.coverPicture
                }
                alt=""
              />
              <img
                className="profileUserImg"
                src={
                  user._id === profileUser._id
                    ? profilePicture === user.profilePicture
                      ? profilePicture
                      : URL.createObjectURL(profilePicture)
                    : profileUser.profilePicture
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
                    <label htmlFor="file" className="changeImg">
                      <span className="shareOptionText">
                        Change profile image
                      </span>
                      <input
                        style={{ display: "none" }}
                        type="file"
                        id="file"
                        accept=".png,.jpeg,.jpg"
                        onChange={(e) => setProfilePicture(e.target.files[0])}
                      />
                    </label>
                    {profilePicture !== user.profilePicture && (
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
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={profileUser} />
          </div>
        </div>
      </div>
    </>
  );
}
