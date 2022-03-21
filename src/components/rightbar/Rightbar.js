import "./rightbar.css";
import Contact from "../contact/Contact";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SuggestedFriends from "../suggestedFriends/SuggestedFriends";
import { useDispatch, useSelector } from "react-redux";
import useFriends from "../../hooks/useFriends";

export default function Rightbar() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const friends = useFriends(user);

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
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
      </div>
    </div>
  );
}
