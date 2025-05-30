import { useState } from "react";
import axios from "axios";

function CreateChannel({ onClose, onCreate, userId }) {
  const [channelName, setChannelName] = useState("");
  const [channelHandle, setChannelHandle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      channelName: channelName.trim(),
      handle: channelHandle.trim(),
      description: description.trim(),
      channelBannerUrl: bannerUrl.trim(),
      owner: userId,
    };

    try {
      const response = await axios.post(
        "https://youtube-clone-bakend-1.onrender.com/api/channels",
        requestData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success && response.data.channel) {
        onCreate(response.data.channel);
        alert("Channel created successfully!");
        onClose();
      } else {
        throw new Error(response.data.message || "Invalid server response");
      }
    } catch (error) {
      console.error("Error creating channel:", error.response?.data || error);
      alert(
        error.response?.data?.message ||
          "Failed to create channel. Please try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 p-4">
      <div className="bg-white p-6 rounded-lg max-w-sm sm:max-w-md md:max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Create Your Channel
        </h2>

        <input
          type="text"
          placeholder="Channel Name"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg my-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
        />

        <input
          type="text"
          placeholder="@Handle"
          value={channelHandle}
          onChange={(e) => setChannelHandle(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg my-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
        />

        <textarea
          value={description}
          placeholder="Channel Description"
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg my-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
        ></textarea>

        <input
          type="text"
          placeholder="Channel Banner Url"
          value={bannerUrl}
          onChange={(e) => setBannerUrl(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg my-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
        />

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-300 hover:bg-gray-400 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
          >
            Create Channel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateChannel;
