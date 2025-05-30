import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import axios from "axios";
import { FaEllipsisV, FaUserCircle } from "react-icons/fa";
import defaultchannel from "../assets/defaultchannel.jpg";
import { timeAgo } from "../utils/timeAgo";

function HomePage() {
  const { searchText, setSearchText, isSidebarOpen } = useOutletContext(); //Get search text from App.jsx
  const [videos, setVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredVideos, setFilteredVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          "https://youtube-clone-bakend-1.onrender.com/api/videos"
        );
        const allVideos = Array.isArray(response.data) ? response.data : [];
        setVideos(allVideos); // ✅ Store fetched videos
        setFilteredVideos(allVideos); // ✅ Initially show all videos
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, []); // ✅ Fetch only once on mount

  useEffect(() => {
    let updatedVideos = [...videos];

    // 🔹 Apply search filter
    if (searchText.trim() !== "") {
      updatedVideos = updatedVideos.filter((video) =>
        video.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 🔹 Apply category filter
    if (selectedCategory !== "All") {
      updatedVideos = updatedVideos.filter(
        (video) => video.category === selectedCategory
      );
    }
    setFilteredVideos(updatedVideos);
  }, [selectedCategory, searchText, videos]); // ✅ Runs when category, searchText, or videos change

  const categories = ["All", ...new Set(videos.map((video) => video.category))];

  return (
    <div
      className={`min-h-screen w-full flex flex-col pt-24 px-2 transition-all duration-300 ${
        isSidebarOpen ? "ml-64" : ""
      }`}
    >
      {/* Category buttons */}
      <div className="flex flex-wrap gap-6 justify-center mb-5">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-3 py-1 rounded-lg font-semibold text-md ${
              selectedCategory === category
                ? "bg-gray-900 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => {
              setSelectedCategory(category);
              setSearchText("");
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {filteredVideos.map((video) => (
          <Link key={video._id} to={`/video/${video._id}`}>
            <div className="p-1 ">
              {/* Thumbnail */}
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-48 object-cover rounded-xl"
              />

              {/* Channel Avatar + Title */}
              <div className="mt-2 flex items-center gap-2">
                {/* Channel Avatar */}

                <img
                  src={video.channelId?.channelBannerUrl || defaultchannel}
                  alt="Channel Avatar"
                  className="w-10 h-10 rounded-full"
                />

                {/* Title */}
                <h3 className="font-semibold flex-1">{video.title}</h3>

                {/* More Options Icon */}
                <FaEllipsisV className="text-gray-500 cursor-pointer pt-1" />
              </div>

              {/* Uploader and Views */}
              <p className="text-gray-600 text-sm font-medium ml-12 cursor-pointer hover:text-gray-800">
                {video.uploader || video.channelId?.channelName}
              </p>
              <p className="text-gray-500 text-sm font-medium ml-12 cursor-pointer">
                {video.views} views • {timeAgo(video.uploadDate)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* No Videos Message */}
      {filteredVideos.length === 0 && (
        <p className="text-center text-gray-600 mt-4">No videos available.</p>
      )}
    </div>
  );
}

export default HomePage;
