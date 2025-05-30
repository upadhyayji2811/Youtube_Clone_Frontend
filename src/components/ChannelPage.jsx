import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import { timeAgo } from "../utils/timeAgo";
import defaultchannel from "../assets/defaultchannel.jpg";

function ChannelPage() {
  const { handle } = useParams(); // Get channel handle from URL
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showOptions, setShowOptions] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedThumbnail, setUpdatedThumbnail] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedVideoUrl, setUpdatedVideoUrl] = useState("");

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const response = await axios.get(
          `https://youtube-clone-bakend-1.onrender.com/api/channels/handle/${handle}`
        );
        setChannel(response.data);
      } catch (error) {
        console.error("Error fetching channel data:", error);
      }
    };

    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `https://youtube-clone-bakend-1.onrender.com/api/videos/channel/${handle}`
        );
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchChannelData();
    fetchVideos();
  }, [handle]);

  // Function to delete a video
  const handleDelete = async (videoId) => {
    try {
      await axios.delete(
        `https://youtube-clone-bakend-1.onrender.com/api/videos/${videoId}`
      );
      alert("Video deleted successfully!");

      // Update state to remove deleted video
      setVideos(videos.filter((video) => video._id !== videoId));
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Failed to delete video.");
    }
  };

  // Function to open edit modal
  const openEditModal = (video) => {
    setSelectedVideo(video);
    setUpdatedTitle(video.title);
    setUpdatedThumbnail(video.thumbnailUrl);
    setUpdatedDescription(video.description);
    setUpdatedVideoUrl(video.videoUrl);
  };

  // Function to update video
  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `https://youtube-clone-bakend-1.onrender.com/api/videos/${selectedVideo._id}`,
        {
          title: updatedTitle,
          thumbnailUrl: updatedThumbnail,
          description: updatedDescription,
          videoUrl: updatedVideoUrl,
        }
      );

      if (response.data) {
        alert("Video updated successfully!");

        // Update state
        setVideos(
          videos.map((video) =>
            video._id === selectedVideo._id ? response.data.video : video
          )
        );
        setSelectedVideo(null);
      }
    } catch (error) {
      console.error("Error updating video:", error);
      alert("Failed to update video.");
    }
  };

  if (!channel) {
    return (
      <div className="text-center text-lg font-semibold py-10">Loading...</div>
    );
  }

  return (
    <div className=" mt-20 px-4 md:px-10">
      {/* Banner */}
      <div className="w-full h-40 sm:h-56 md:h-64 lg:h-80 bg-gray-200 overflow-hidden">
        <img
          src={channel.channelBannerUrl || defaultchannel}
          alt="Banner"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      {/* Channel Info */}
      <div className="py-6 flex flex-wrap flex-row gap-6 md:justify-start justify-center">
        <div className="w-20 h-20 sm:w-28 sm:h-28 md:h-32 md:w-32">
          <img
            src={channel.channelBannerUrl || defaultchannel}
            alt="Channel Logo"
            className="w-full h-full rounded-full"
          />
        </div>

        <div className="md:text-left text-center">
          <h1 className="text-xl sm:text-2xl font-bold">
            {channel.channelName}
          </h1>
          <div className="flex flex-wrap justify-start gap-3 text-gray-600 text-sm sm:text-base">
            <p className="text-gray-800 font-semibold">{channel.handle} </p>
            <p className="text-gray-600">
              • {channel.subscribers} subscribers{" "}
            </p>
          </div>
          <p className="text-gray-700 mt-2">{channel.description}</p>
          <button className="mt-4 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800">
            Subscribe
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-300 flex gap-8 overflow-x-auto text-gray-600 text-sm sm:text-base font-semibold">
        <button className="py-4  hover:text-black">Home</button>
        <button className="py-4 text-black border-b-2 border-black">
          Videos
        </button>
        <button className="py-4 hover:text-black">Shorts</button>
        <button className="py-4 hover:text-black">Playlists</button>
        <button className="py-4 hover:text-black">Posts</button>
      </div>

      {/* Videos Section */}
      <div className="py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video) => (
            <div
              key={video._id}
              className="relative rounded-lg overflow-hidden"
            >
              <Link to={`/video/${video._id}`}>
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-40 object-cover rounded-lg"
                />

                <div className="py-2">
                  <p className="text-sm font-semibold">{video.title}</p>
                  <p className="text-xs text-gray-500">
                    {video.views} views • {timeAgo(video.uploadDate)}
                  </p>
                </div>
              </Link>

              {/* Options Button */}
              <button
                className="absolute top-2 right-2 p-2 bg-gray-100 rounded-full"
                onClick={() =>
                  setShowOptions(showOptions === video._id ? null : video._id)
                }
              >
                <FaEllipsisV />
              </button>

              {/* Dropdown Menu */}
              {showOptions === video._id && (
                <div className="absolute right-2 top-10 bg-white shadow-lg p-2 rounded-lg">
                  <button
                    onClick={() => openEditModal(video)}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(video._id)}
                    className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Edit Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-72 sm:w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Video</h2>

            <input
              type="text"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg my-2"
              placeholder="Video Title"
            />

            <textarea
              placeholder="Description"
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg my-2"
            ></textarea>

            <input
              type="text"
              value={updatedThumbnail}
              onChange={(e) => setUpdatedThumbnail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg my-2"
              placeholder="Thumbnail URL"
            />

            <input
              type="text"
              value={updatedVideoUrl}
              onChange={(e) => setUpdatedVideoUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg my-2"
              placeholder="Thumbnail URL"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setSelectedVideo(null)}
                className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChannelPage;
