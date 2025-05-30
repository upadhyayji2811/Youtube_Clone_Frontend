import React, { useEffect, useState } from "react";
import axios from "axios";

function UploadVideoModal({ onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [category, setCategory] = useState("");
  const [channelId, setChannelId] = useState(""); // Fetch from logged-in user

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) {
      fetchChannelId(user.id);
    }
  }, []);

  const fetchChannelId = async (userId) => {
    try {
      const response = await axios.get(
        `https://youtube-clone-bakend-1.onrender.com/api/channels/user/${userId}`
      );
      if (response.data?._id) {
        setChannelId(response.data._id);
      } else {
        console.warn("No channel ID found for this user.");
      }
    } catch (error) {
      console.error("Error fetching channel Id:", error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!videoUrl.startsWith("http")) {
      alert("Please enter a valid video URL!");
      return;
    }
    if (!channelId) {
      alert("Channel ID is missing");
      return;
    }

    try {
      const response = await axios.post(
        "https://youtube-clone-bakend-1.onrender.com/api/videos",
        {
          title,
          description,
          thumbnailUrl,
          videoUrl,
          category,
          channelId,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      alert("Video uploaded successfully!");
      onClose(); // Close modal after upload
    } catch (error) {
      console.error(
        "Upload failed:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to upload video.");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full m-4">
        <h2 className="text-xl font-bold mb-4">Upload Video</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
          <input
            type="text"
            placeholder="Thumbnail URL"
            className="w-full p-2 border rounded"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Category"
            className="w-full p-2 border rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Video URL"
            className="w-full p-2 border rounded"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Upload
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-500 text-white p-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default UploadVideoModal;
