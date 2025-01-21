"use client";
import { useState, useEffect } from "react";
import { FaStream, FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import {
  createStream,
  deleteStream,
  getStreams,
  updateStream,
} from "@/app/action/stream/action";

// Define the Stream type
type Stream = {
  id: string;
  streamName: string;
  streamcode: string;
};

// Define API response type
type StreamApiResponse = {
  success: boolean;
  streams?: Stream[];
  error?: string;
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

  // Fetch streams
  const fetchStreams = async () => {
    try {
      const result: StreamApiResponse = await getStreams();
      if (result.success && result.streams) {
        setStreams(result.streams);
      } else {
        console.error("Error fetching streams:", result.error);
        alert(`Error fetching streams: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while fetching streams.");
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStreams();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    const validationErrors: Record<string, string> = {};
    if (!streamData.streamName) {
      validationErrors.streamName = "Stream name is required.";
    }
    if (!streamData.streamcode) {
      validationErrors.streamcode = "Stream code is required.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      let result;
      const formData = new FormData();
      formData.append("streamName", streamData.streamName);
      formData.append("streamcode", streamData.streamcode);

      if (editStream) {
        result = await updateStream(editStream.id, formData);
      } else {
        result = await createStream(formData);
      }

      if (result.success) {
        alert(`Stream ${editStream ? "updated" : "added"} successfully.`);
        setEditStream(null);
        setStreamData({ streamName: "", streamcode: "" });
        fetchStreams();
      } else {
        alert(`Error: ${result.error || "Failed to save stream."}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (stream: Stream) => {
    setEditStream(stream);
    setStreamData({
      streamName: stream.streamName,
      streamcode: stream.streamcode,
    });
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this stream?")) return;

    try {
      const result = await deleteStream(id);
      if (result.success) {
        alert("Stream deleted successfully.");
        fetchStreams();
      } else {
        alert(`Error: ${result.error || "Failed to delete stream."}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while deleting the stream.");
    }
  };

  // Filter streams
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
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.streamcode && (
                <p className="text-sm text-red-400 mt-1">{errors.streamcode}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center"
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
            className="w-full px-4 py-3 pl-10 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleEdit(stream)}
                          className="text-blue-500 hover:text-blue-700 transition duration-300"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(stream.id)}
                          className="text-red-500 hover:text-red-700 transition duration-300"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStreams.length === 0 && (
            <div className="p-6 text-center text-gray-400">
              No streams found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamManagement;
