import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import HistoryIcon from "@mui/icons-material/History";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import PersonIcon from "@mui/icons-material/Person";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import MovieIcon from "@mui/icons-material/Movie";
import NewsIcon from "@mui/icons-material/Article";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import { useNavigate } from "react-router-dom";
import "../index.css";

const menuItems = [
  { name: "Home", icon: <HomeIcon />, path: "/" },
  { name: "Shorts", icon: <WhatshotIcon /> },
  { name: "Subscriptions", icon: <SubscriptionsIcon /> },
  { name: "You", icon: <AccountCircleIcon /> },
];

const exploreItems = [
  { name: "Trending", icon: <WhatshotIcon /> },
  { name: "Gaming", icon: <SportsEsportsIcon /> },
  { name: "Music", icon: <MusicNoteIcon /> },
  { name: "Movies", icon: <MovieIcon /> },
  { name: "News", icon: <NewsIcon /> },
  { name: "Live", icon: <LiveTvIcon /> },
];

const yourItems = [
  { name: "History", icon: <HistoryIcon /> },
  { name: "Playlists", icon: <VideoLibraryIcon /> },
  { name: "Your videos", icon: <PersonIcon /> },
  { name: "Watch later", icon: <VideoLibraryIcon /> },
  { name: "Liked videos", icon: <ThumbUpIcon /> },
];

function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  return (
    <>
      {/* Sidebar Overlay (for small screens) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside
        className={`fixed top-14 left-0 min-h-screen bg-white transition-all duration-300 ${
          isOpen ? " w-64 z-50" : "w-0 md:w-24"
        } 
       overflow-y-auto max-h-screen custom-scrollbar`} //Added custom class
      >
        <nav className="flex flex-col gap-2 p-1">
          {/* Main Menu */}
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 pt-4 px-2 hover:bg-gray-200 rounded cursor-pointer"
              onClick={() => navigate(item.path)}
            >
              {!isOpen ? (
                <div className="flex flex-col justify-center">
                  <span className="hidden md:block">{item.icon}</span>
                  <span className="text-xs hidden md:block text-center">
                    {item.name}
                  </span>
                </div>
              ) : (
                item.name !== "You" && (
                  <>
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </>
                )
              )}
            </div>
          ))}

          {/* Your Section */}
          {isOpen && (
            <>
              <hr className="my-2" />
              <h3 className="text-md font-semibold px-3">You</h3>
              {yourItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-2 hover:bg-gray-200 rounded cursor-pointer"
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </div>
              ))}
            </>
          )}

          {/* Explore Section */}
          {isOpen && (
            <>
              <hr className="my-2" />
              <h3 className="text-md font-semibold px-3">Explore</h3>
              {exploreItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-2 hover:bg-gray-200 rounded cursor-pointer"
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </div>
              ))}
            </>
          )}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
