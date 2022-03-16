import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import storage from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function Profile() {
  const { user, dispatch } = useContext(AuthContext);
  const { accessToken } = user;
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { username } = useParams();
  const [profilePic, setProfilePic] = useState(user.profilePicture);
  const [profileUser, setProfileUser] = useState({});
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    success: true,
  });

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
      // dispatch({
      //   type: "LOGIN_SUCCESS",
      //   payload: res.data.data,
      // });
    };
    fetchUser();
  }, [username]);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_START" });
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
        dispatch({
          type: "UPDATE_SUCCESS",
          payload: { ...updatedUser, accessToken },
        });
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
        dispatch({
          type: "UPDATE_FAILURE",
        });
      }
    };
    if (profilePic) {
      const filename = new Date().getTime() + profilePic.name;
      const uploadTask = uploadBytesResumable(
        ref(storage, `/profile/${filename}`),
        profilePic
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
              <img
                className="profileCoverImg"
                src={profileUser.coverPicture}
                alt=""
              />
              <img
                className="profileUserImg"
                src={
                  user === profileUser
                    ? profilePic === user.profilePicture
                      ? profilePic
                      : URL.createObjectURL(profilePic)
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
                        onChange={(e) => setProfilePic(e.target.files[0])}
                      />
                    </label>
                    {profilePic !== user.profilePicture && (
                      <button>UPDATE</button>
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
