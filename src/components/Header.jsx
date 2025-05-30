import React, { useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineSearch } from "react-icons/ai";
import { PiUserCircle } from "react-icons/pi";
import logo from "../assets/logo.jpg";
import { useNavigate } from "react-router-dom";
import CreateChannel from "./CreateChannel";
import { Link } from "react-router-dom";
import axios from "axios";
import UploadVideoModal from "./UploadVideoForm";

function Header({ handleSearch, isSidebarOpen, setIsSidebarOpen }) {
  const [inputText, setInputText] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [username, setUserName] = useState("");
  const [channelHandle, setChannelHandle] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const navigate = useNavigate();

  // Check if the user is loggen in (JWT in local storage)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user"); //store entire user object

    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setIsSignedIn(true);
      setUserName(parsedUser.username);
      setAvatar(parsedUser.avatar);

      //Fetch the channel handle based on the user ID
      fetchUserChannel(parsedUser.id);
    }
  }, []);

  const handleSearchClick = () => {
    handleSearch(inputText);
    setInputText("");
  };

  //Fetch the user's channel handle
  const fetchUserChannel = async (userId) => {
    if (!userId) {
      console.error("User ID is missing");
      return;
    }
    try {
      const response = await axios.get(
        `https://youtube-clone-bakend-1.onrender.com/api/channels/user/${userId}`
      );
      if (response.data && response.data.handle) {
        setChannelHandle(response.data.handle);
      } else {
        console.warn("Channel not found");
      }
    } catch (error) {
      console.error("Error fetching channel handle:", error);
    }
  };

  const handleCreateChannel = (channelData) => {
    // console.log("Channel Created:", channelData);
    setShowModal(false);
    setChannelHandle(channelData.handle); //Update handle after channel creation
  };

  // Handle sign Out
  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsSignedIn(false);
    setUserName("");
    setChannelHandle(null);
    navigate("/"); //Redirect to home
  };

  return (
    <>
      <header className="flex items-center justify-between px-2 py-2 bg-white fixed w-full top-0 z-50">
        {/* Left section: Menu + logo */}
        <div className="flex items-center  lg:gap-4 gap-1 flex-shrink-0">
          <AiOutlineMenu
            className="w-7 h-7 cursor-pointer"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <Link to="/">
            <img
              src={logo}
              alt="YouTube"
              className="w-24 min-w-[100px] cursor-pointer flex-shrink-0"
            />
          </Link>
        </div>

        {/* Middle Section: Search Bar */}
        <div className="flex items-center w-full max-w-xl flex-1 mx-2">
          <input
            type="text"
            placeholder="Search"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full px-3 py-1 sm:py-2 border border-gray-300 rounded-l-full outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            className="px-1 md:px-2 py-1 sm:py-2 bg-gray-100 border border-gray-300 hover:bg-gray-200 border-l rounded-r-full"
            onClick={handleSearchClick}
          >
            <AiOutlineSearch className="w-6 h-6 cursor-pointer" />
          </button>
        </div>

        {/* Right Section: Icons or Sign-In  Button */}
        <div className="flex items-center gap-1 lg:gap-4 flex-shrink-0">
          <div>
            {isSignedIn && !channelHandle && (
              <button
                onClick={() => setShowModal(true)}
                className="border bg-red-500 text-white md:px-3 px-2 py-2 rounded-full hover:bg-red-600 text-xs lg:text-base flex-shrink-0"
              >
                Create Channel
              </button>
            )}
          </div>
          {showModal && (
            <CreateChannel
              onClose={() => setShowModal(false)}
              onCreate={handleCreateChannel}
              userId={JSON.parse(localStorage.getItem("user"))?.id}
            />
          )}

          {channelHandle && (
            <button
              onClick={() => setShowUploadModal(true)}
              className=" border bg-blue-500 hover:bg-blue-600 text-white md:px-3 px-2 py-2 rounded-full text-xs lg:text-sm flex-shrink-0"
            >
              Upload Video
            </button>
          )}
          {showUploadModal && (
            <UploadVideoModal
              onClose={() => setShowUploadModal(false)}
              handle={channelHandle}
            />
          )}
          {/* Avatar dropdown */}
          {isSignedIn ? (
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                {avatar ? (
                  <img
                    src={avatar}
                    alt="User Avatar"
                    className="w-7 h-7 sm:w-10 sm:h-10 rounded-full border border-gray-300 object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-500 text-white font-semibold text-lg uppercase">
                    {username.charAt(0)}
                  </div>
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <h2 className="text-lg font-semibold">{username}</h2>
                      <p className="text-sm text-gray-500">
                        {channelHandle ? `${channelHandle}` : `@${username}`}
                      </p>
                    </div>
                  </div>
                  <hr className="my-2" />
                  {channelHandle ? (
                    <Link
                      to={`/channel/${channelHandle}`}
                      className="block px-3 py-2 text-blue-600 hover:bg-gray-100 rounded-lg"
                      onClick={() => setDropdownOpen(false)}
                    >
                      View Your Channel
                    </Link>
                  ) : (
                    <p className="text-gray-500 px-3 py-2">No channel found</p>
                  )}

                  <button
                    onClick={() => {
                      handleSignOut();
                      setDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-gray-100 rounded-lg"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/signin")}
              className="border px-3 py-1 sm:py-2 text-blue-700 rounded-full hover:bg-blue-100 cursor-pointer flex items-center gap-1 flex-shrink-0"
            >
              <PiUserCircle className="w-6 h-6" />
              <p className="font-semibold text-sm sm:text-base">Sign In</p>
            </button>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
