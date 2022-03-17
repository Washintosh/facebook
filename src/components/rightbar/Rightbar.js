import "./rightbar.css";
import Contact from "../contact/Contact";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Add, Remove } from "@material-ui/icons";
import SuggestedFriends from "../suggestedFriends/SuggestedFriends";
import { getFriends } from "../../apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { follow, unfollow } from "../../redux/userSlice";

export default function Rightbar({ user }) {
  const [friends, setFriends] = useState([]);
  const [followed, setFollowed] = useState(false);
  const { user: currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    setFollowed(currentUser.followings.includes(user?._id));
  }, [user]);

  useEffect(() => {
    getFriends(currentUser, setFriends);
  }, []);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(
          `http://localhost:7000/api/users/${user._id}/unfollow`,
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
        dispatch(unfollow(user._id));
      } else {
        await axios.put(
          `http://localhost:7000/api/users/${user._id}/follow`,
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
        dispatch(follow(user._id));
      }
      setFollowed(!followed);
    } catch (err) {}
  };
  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <SuggestedFriends />
        <h4 className="rightbarTitle">Contacts</h4>
        <ul className="rightbarFriendList">
          {friends.map((u) => (
            <Contact key={u._id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {user.relationship === 1
                ? "Single"
                : user.relationship === 1
                ? "Married"
                : "-"}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link
              key={friend._id}
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={friend.profilePicture}
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
