"use client";

import { useState, useEffect } from "react";

type Stream = {
  id: string;
  streamName: string;
  streamcode: string;
};

const StreamManagement = () => {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [editStream, setEditStream] = useState<Stream | null>(null);
  const [streamData, setStreamData] = useState({
    streamName: "",
    streamcode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchStreams = async () => {
    try {
      const response = await fetch("/api/streams");
      if (!response.ok) {
        throw new Error("Failed to fetch streams");
      }
      const data = await response.json();
      setStreams(data.streams);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching streams:", error);
        alert(`Error fetching streams: ${error.message}`);
      } else {
        console.error("Unknown error fetching streams");
        alert("Unknown error fetching streams");
      }
    }
  };

  useEffect(() => {
    fetchStreams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!streamData.streamName || !streamData.streamcode) {
      setErrors({
        streamName: !streamData.streamName ? "Stream name is required" : "",
        streamcode: !streamData.streamcode ? "Stream code is required" : "",
      });
      setIsSubmitting(false);
      return;
    }

    const method = editStream ? "PUT" : "POST";
    const url = editStream ? `/api/streams/${editStream.id}` : "/api/streams";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(streamData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save stream");
      }

      alert(`Stream ${editStream ? "updated" : "added"} successfully.`);
      setEditStream(null);
      setStreamData({ streamName: "", streamcode: "" });
      fetchStreams();
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("Unknown error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (stream: Stream) => {
    setEditStream(stream);
    setStreamData({
      streamName: stream.streamName,
      streamcode: stream.streamcode,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this stream?")) return;

    try {
      const response = await fetch(`/api/streams/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete stream");
      }

      alert("Stream deleted successfully.");
      fetchStreams();
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("Unknown error occurred");
      }
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Stream Management</h1>

      {/* Add/Edit Stream Form */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8 max-w-lg mx-auto">
        <h2 className="text-2xl mb-4">
          {editStream ? "Edit Stream" : "Add New Stream"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Stream Name
            </label>
            <input
              type="text"
              value={streamData.streamName}
              onChange={(e) =>
                setStreamData({ ...streamData, streamName: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.streamName && (
              <p className="text-sm text-red-400 mt-1">{errors.streamName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Stream Code
            </label>
            <input
              type="text"
              value={streamData.streamcode}
              onChange={(e) =>
                setStreamData({ ...streamData, streamcode: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.streamcode && (
              <p className="text-sm text-red-400 mt-1">{errors.streamcode}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isSubmitting
              ? "Submitting..."
              : editStream
                ? "Update Stream"
                : "Add Stream"}
          </button>
        </form>
      </div>

      {/* Stream List */}
      <div className="overflow-x-auto bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Stream List</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left border-b text-lg">
                Stream Name
              </th>
              <th className="px-4 py-2 text-left border-b text-lg">
                Stream Code
              </th>
              <th className="px-4 py-2 text-left border-b text-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {streams.map((stream) => (
              <tr key={stream.id} className="border-b">
                <td className="px-4 py-2">{stream.streamName}</td>
                <td className="px-4 py-2">{stream.streamcode}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(stream)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(stream.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StreamManagement;
