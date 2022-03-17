import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import SidebarDesktop from "../../components/sidebarDesktop/SidebarDesktop";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./home.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { hideAlert } from "../../redux/alertSlice";

export default function Home() {
  const { message, show, error } = useSelector((state) => state.alert);
  const dispatch = useDispatch();
  useEffect(() => {
    if (show) {
      const timeout = setTimeout(() => {
        dispatch(hideAlert());
      }, 4500);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [show]);

  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <div className="alertContainer">
          <div
            className={`alert ${show ? "show" : ""} ${
              error ? "error" : "success"
            }`}
          >
            {message}
          </div>
        </div>
        <Sidebar />
        <SidebarDesktop />
        <div className="leftSpace"></div>
        <Feed />
        <div className="rightSpace"></div>
        <Rightbar />
      </div>
    </>
  );
}
