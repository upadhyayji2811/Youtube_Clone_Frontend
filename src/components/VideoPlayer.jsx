import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEllipsisV, FaEllipsisH, FaUserCircle } from "react-icons/fa";
import { BiLike, BiSolidLike, BiDislike, BiSolidDislike } from "react-icons/bi";
import { TfiDownload } from "react-icons/tfi";
import { RiShareForwardLine } from "react-icons/ri";
import { timeAgo } from "../utils/timeAgo";
import defaultchannel from "../assets/defaultchannel.jpg";

function VideoPlayer() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showOptions, setShowOptions] = useState(null); //Track which comment's menu is open
  const [commentFocused, setCommentFocused] = useState(false);
  const [likedStatus, setLikedStatus] = useState(null);

  //Retrieve user info from locaStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const avatar = user?.avatar; // Use optional chaining
  const id = user?.id;
  // const { avatar, id } = user;

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(
          `https://youtube-clone-bakend-1.onrender.com/api/videos/${videoId}`
        );
        setVideo(res.data);
        setLikes(res.data.likes);
        setDislikes(res.data.dislikes);
        setComments(res.data.comments || []);

        // Check if user liked or disliked
        if (res.data.likedBy.includes(id)) {
          setLikedStatus("liked");
        } else if (res.data.dislikedBy.includes(id)) {
          setLikedStatus("disliked");
        } else {
          setLikedStatus(null);
        }
      } catch (error) {
        console.error("Error in fetching video:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendedVideos = async () => {
      try {
        const res = await axios.get(
          "https://youtube-clone-bakend-1.onrender.com/api/videos"
        );
        setRecommendedVideos(res.data.filter((vid) => vid._id !== videoId));
      } catch (error) {
        console.error("Error in fetching recommended vidoes:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `https://youtube-clone-bakend-1.onrender.com/api/comments/${videoId}`
        );
        // console.log("Comments", res.data);
        setComments(res.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchVideo();
    fetchRecommendedVideos();
    fetchComments();
  }, [videoId]);

  if (loading) return <p className="text center mt-10">Loading...</p>;
  if (!video)
    return (
      <p className="text-center mt-10 text-xl font-semibold">Video not found</p>
    );

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `https://youtube-clone-bakend-1.onrender.com/api/videos/${videoId}/like`,
        {},
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );
      // console.log("API response:", res.data);
      setLikes(res.data.likes); // Update UI with new likes count
      setDislikes(res.data.dislikes);
      if (res.data.likedBy && Array.isArray(res.data.likedBy)) {
        setLikedStatus(res.data.likedBy.includes(id) ? "liked" : null);
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleDislike = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `https://youtube-clone-bakend-1.onrender.com/api/videos/${videoId}/dislike`,
        {},
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );
      // console.log("API response:", res.data);
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes); // Update UI with new dislikes count
      if (res.data.likedBy && Array.isArray(res.data.likedBy)) {
        setLikedStatus(res.data.dislikedBy.includes(id) ? "disliked" : null);
      }
    } catch (error) {
      console.error("Error updating dislikes:", error);
    }
  };

  const addComment = async () => {
    if (newComment.trim()) {
      try {
        const token = localStorage.getItem("token"); // Retrieve token
        const res = await axios.post(
          `https://youtube-clone-bakend-1.onrender.com/api/comments/${videoId}`,
          {
            videoId,
            text: newComment,
          },
          {
            headers: { Authorization: `JWT ${token}` },
          }
        );
        setComments([res.data.comment, ...comments]);
        setNewComment("");
        setCommentFocused(false);
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  // Function to toggle menu visibility
  const toggleOptions = (commentId) => {
    setShowOptions(showOptions === commentId ? null : commentId);
  };

  // Function to delete comment
  const deleteComment = async (commentId) => {
    try {
      await axios.delete(
        `https://youtube-clone-bakend-1.onrender.com/api/comments/${commentId}`
      );
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error("Error in deleting comment:", error);
    }
  };

  //Function to enable edit mode
  const enableEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.text);
    setShowOptions(null);
  };

  // Function to save edited comment
  const saveEdit = async (commentId) => {
    try {
      const res = await axios.put(
        `https://youtube-clone-bakend-1.onrender.com/comments/${commentId}`,
        { text: editText }
      );
      setComments(
        comments.map((comment) =>
          comment._id === commentId
            ? { ...comment, text: res.data.text }
            : comment
        )
      );
      setEditingCommentId(null);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  return (
    <div className="max-w-screen-xl lg flex flex-col lg:flex-row gap-6 pt-20 px-4">
      {/* Left: Video Player & Details */}
      <div className="flex-1">
        {/* Video Player */}
        <div className="w-full aspect-video">
          <iframe
            className="w-full h-[280px] sm:h-[360px] md:h-[420px] lg:h-[480px] xl:h-[540px] rounded-lg"
            src={video.videoUrl.replace("watch?v=", "embed/")}
            title={video.title}
            allowFullScreen
          ></iframe>
        </div>

        {/* Video Info */}
        <h2 className="text-xl sm:text-2xl font-bold mt-4">{video.title}</h2>
        <div className="flex flex-col flex-wrap sm:flex-row justify-between my-4 gap-3">
          <div className="flex flex-wrap gap-4 items-center">
            <img
              src={video.channelId?.avatar || defaultchannel}
              alt="Channel Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-gray-800 font-semibold">
                {video.uploader || video.channelId?.channelName}
              </p>
              <p className="text-gray-600 text-sm">
                {video.channelId?.subscribers} subscribers
              </p>
            </div>
            <button className="bg-black text-white px-4 py-1 rounded-3xl hover:bg-gray-800">
              Subscribe
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex">
              <button
                onClick={handleLike}
                className="flex bg-gray-100 hover:bg-gray-200 items-center gap-2 p-2 rounded-s-3xl"
              >
                {likedStatus === "liked" ? (
                  <BiSolidLike className="text-2xl" />
                ) : (
                  <BiLike className="text-2xl" />
                )}
                {likes}
              </button>
              <div className="h-10 border-l-2 border-gray-400"></div>
              <button
                onClick={handleDislike}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-e-3xl"
              >
                {likedStatus === "disliked" ? (
                  <BiSolidDislike className="text-2xl" />
                ) : (
                  <BiDislike className="text-2xl" />
                )}
              </button>
            </div>
            <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 p-2 px-4 rounded-3xl">
              <RiShareForwardLine className="text-2xl" /> Share
            </button>
            <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 p-2 px-4 rounded-3xl">
              <TfiDownload /> Download
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full">
              <FaEllipsisH />
            </button>
          </div>
        </div>

        <div className="bg-gray-100 p-2 rounded cursor-pointer">
          <p className="text-gray-600">
            {video.views} views • {timeAgo(video.uploadDate)}
          </p>
          <p>{video.description}</p>
        </div>

        {/* Comments Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">
            {comments.length > 0 ? comments.length : ""} Comments
          </h3>
          <div className="flex items-center gap-3 mb-4">
            <img
              src={avatar || defaultchannel}
              alt="User avatar"
              className="w-10 h-10 rounded-full"
            />
            <input
              type="text"
              className={`flex-1 p-2  border-b outline-none ${
                commentFocused ? "border-black" : "border-gray-300"
              }`}
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onFocus={() => setCommentFocused(true)}
            />
          </div>
          {commentFocused && (
            <div className="flex font-semibold justify-end gap-4 mt-2">
              <button
                className="text-black hover:bg-gray-200 rounded-3xl px-3 py-1"
                onClick={() => setCommentFocused(false)}
              >
                Cancel
              </button>
              <button
                className="text-blue-500 hover:text-white hover:bg-blue-500 px-3 py-1 rounded-3xl"
                onClick={addComment}
              >
                Comment
              </button>
            </div>
          )}

          {/* Display comments */}
          <div className="mt-4">
            {comments.map((comment) => {
              const avatarUrl = comment.userId?.avatar;
              return (
                <div
                  key={comment._id}
                  className="border-b flex items-start gap-3 pb-2"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full"
                      onError={(e) =>
                        (e.target.style.display = { defaultchannel })
                      } // Hide if image fails to load
                    />
                  ) : (
                    <FaUserCircle className="w-10 h-10 text-gray-500" />
                  )}

                  <div className="flex-1">
                    <div className="flex gap-3">
                      <p className="font-semibold">@{comment.username}</p>
                      <div className="text-gray-700 text-xs pt-1">
                        {timeAgo(comment.createdAt)}
                      </div>
                    </div>

                    {editingCommentId === comment._id ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      <p>{comment.text}</p>
                    )}

                    <div className="flex gap-4 pt-2">
                      <BiLike className="" />
                      <BiDislike />
                      <button className="text-xs">Reply</button>
                    </div>
                  </div>

                  {/* Three-dot menu */}
                  <div className="relative">
                    <button
                      onClick={() => toggleOptions(comment._id)}
                      className="text-gray-500"
                    >
                      <FaEllipsisV />
                    </button>

                    {showOptions === comment._id && (
                      <div className="absolute right-0 bg-white shadow-md border rounded p-2">
                        <button
                          onClick={() => enableEdit(comment)}
                          className="block w-full text-left px-2 py-1 hover:bg-gray-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteComment(comment._id)}
                          className="block w-full text-left px-2 py-1 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    )}

                    {/* Save button for editing */}
                    {editingCommentId === comment._id && (
                      <button
                        onClick={() => saveEdit(comment._id)}
                        className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Recommended Videos */}
      <div className="w-full lg:w-1/3 max-h-[600] overflow-y-auto">
        <div className="flex flex-col gap-4">
          {recommendedVideos.map((rec) => (
            <div
              key={rec._id}
              className="flex gap-2 cursor-pointer"
              onClick={() => navigate(`/video/${rec._id}`)}
            >
              <img
                src={rec.thumbnailUrl}
                alt={rec.title}
                className="w-28 md:w-32 h-20 object-cover rounded"
              />
              <div className="w-56">
                <p className="text-sm font-semibold">{rec.title}</p>
                <p className="text-sm font-semibold text-gray-500 cursor-pointer">
                  {rec.uploader}
                </p>
                <p className="text-gray-500 text-sm font-medium cursor-pointer">
                  {rec.views} views • {timeAgo(rec.uploadDate)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
