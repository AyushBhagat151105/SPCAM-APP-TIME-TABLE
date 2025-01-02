"use client";
import { useState, useEffect } from "react";
import { FaStream, FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

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
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Streams
  const fetchStreams = async () => {
    try {
      const response = await fetch("/api/streams");
      if (!response.ok) {
        throw new Error("Failed to fetch streams");
      }
      const data = await response.json();
      setStreams(data.streams);
    } catch (error) {
      console.error("Error fetching streams:", error);
      alert(
        `Error fetching streams: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  // Initial Data Fetch
  useEffect(() => {
    fetchStreams();
  }, []);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
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
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit
  const handleEdit = (stream: Stream) => {
    setEditStream(stream);
    setStreamData({
      streamName: stream.streamName,
      streamcode: stream.streamcode,
    });
  };

  // Handle Delete
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
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  // Filter streams based on search term
  const filteredStreams = streams.filter(
    (stream) =>
      stream.streamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stream.streamcode.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-center mb-10">
          <FaStream className="text-4xl text-indigo-400 mr-4" />
          <h1 className="text-4xl font-bold text-white">Stream Management</h1>
        </div>

        {/* Add/Edit Stream Form */}
        <div className="bg-gray-800 shadow-xl rounded-lg p-8 mb-10">
          <div className="flex items-center mb-6">
            <FaPlus className="text-2xl text-indigo-400 mr-3" />
            <h2 className="text-2xl font-semibold text-white">
              {editStream ? "Edit Stream" : "Add New Stream"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Stream Name
              </label>
              <input
                type="text"
                value={streamData.streamName}
                onChange={(e) =>
                  setStreamData({ ...streamData, streamName: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white
                border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.streamName && (
                <p className="text-sm text-red-400 mt-1">{errors.streamName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Stream Code
              </label>
              <input
                type="text"
                value={streamData.streamcode}
                onChange={(e) =>
                  setStreamData({ ...streamData, streamcode: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white
                border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.streamcode && (
                <p className="text-sm text-red-400 mt-1">{errors.streamcode}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700
              text-white rounded-lg font-semibold transition duration-300
              transform hover:scale-105 focus:outline-none focus:ring-2
              focus:ring-indigo-500 flex items-center justify-center"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : editStream ? (
                <>
                  <FaEdit className="mr-2" /> Update Stream
                </>
              ) : (
                <>
                  <FaPlus className="mr-2" /> Add Stream
                </>
              )}
            </button>
          </form>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search streams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 rounded-lg bg-gray-800
            text-white border border-gray-700 focus:outline-none
            focus:ring-2 focus:ring-indigo-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y -1/2 text-gray-400" />
        </div>

        {/* Stream List */}
        <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-700">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <FaStream className="mr-3 text-indigo-400" />
              Stream List
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Stream Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Stream Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredStreams.map((stream) => (
                  <tr
                    key={stream.id}
                    className="hover:bg-gray-700 transition duration-300"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {stream.streamName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {stream.streamcode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(stream)}
                        className="text-blue-400 hover:text-blue-300 mr-4 transition duration-300"
                      >
                        <FaEdit className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleDelete(stream.id)}
                        className="text-red-400 hover:text-red-300 transition duration-300"
                      >
                        <FaTrash className="text-xl" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamManagement;
