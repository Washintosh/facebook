import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import SidebarDesktop from "../../components/sidebarDesktop/SidebarDesktop";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./home.css";

export default function Home() {
  return (
    <>
      <Topbar />
      <div className="homeContainer">
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
