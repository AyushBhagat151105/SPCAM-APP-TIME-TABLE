// src/components/TeacherManagement.tsx
"use client";
import { useState, useEffect } from "react";
import {
  FaChalkboardTeacher,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

type Teacher = {
  id: string;
  teachername: string;
  teachercode: string;
  userId?: string;
  streams?: Stream[];
};

type User = {
  id: string;
  name: string;
};

type Stream = {
  id: string;
  streamName: string;
};

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [teacherData, setTeacherData] = useState({
    teachername: "",
    teachercode: "",
    userId: "",
    streamIds: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filterStream, setFilterStream] = useState("");

  // Fetch Teachers
  const fetchTeachers = async () => {
    try {
      const res = await fetch("/api/teachers");
      if (!res.ok) {
        throw new Error("Failed to fetch teachers");
      }
      const data = await res.json();
      setTeachers(data.teachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      alert(
        `Error fetching teachers: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/user");
      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await res.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert(
        `Error fetching users: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  // Fetch Streams
  const fetchStreams = async () => {
    try {
      const res = await fetch("/api/streams");
      if (!res.ok) {
        throw new Error("Failed to fetch streams");
      }
      const data = await res.json();
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
    fetchTeachers();
    fetchUsers();
    fetchStreams();
  }, []);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!teacherData.teachername || !teacherData.teachercode) {
      setErrors({
        teachername: !teacherData.teachername ? "Teacher name is required" : "",
        teachercode: !teacherData.teachercode ? "Teacher code is required" : "",
      });
      setIsSubmitting(false);
      return;
    }

    const method = editTeacher ? "PUT" : "POST";
    const url = editTeacher
      ? `/api/teachers/${editTeacher.id}`
      : "/api/teachers";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teacherData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save teacher");
      }

      alert(`Teacher ${editTeacher ? "updated" : "added"} successfully`);
      setEditTeacher(null);
      setTeacherData({
        teachername: "",
        teachercode: "",
        userId: "",
        streamIds: [],
      });
      fetchTeachers();
    } catch (error) {
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit
  const handleEdit = (teacher: Teacher) => {
    setEditTeacher(teacher);
    setTeacherData({
      teachername: teacher.teachername,
      teachercode: teacher.teachercode,
      userId: teacher.userId || "",
      streamIds: teacher.streams?.map((stream) => stream.id) || [],
    });
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;

    try {
      const response = await fetch(`/api/teachers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete teacher");
      }

      alert("Teacher deleted successfully.");
      fetchTeachers();
    } catch (error) {
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  // Filtering method
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.teachername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.teachercode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUser = filterUser ? teacher.userId === filterUser : true;

    const matchesStream = filterStream
      ? teacher.streams?.some((stream) => stream.id === filterStream)
      : true;

    return matchesSearch && matchesUser && matchesStream;
  });

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-center mb-10">
          <FaChalkboardTeacher className="text-4xl text-indigo-400 mr-4" />
          <h1 className="text-4xl font-bold text-white">Teacher Management</h1>
        </div>

        {/* Add/Edit Teacher Form */}
        <div className="bg-gray-800 shadow-xl rounded-lg p-8 mb-10">
          <div className="flex items-center mb-6">
            <FaPlus className="text-2xl text-indigo-400 mr-3" />
            <h2 className="text-2xl font-semibold text-white">
              {editTeacher ? "Edit Teacher" : "Add New Teacher"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Teacher Name
              </label>
              <input
                type="text"
                value={teacherData.teachername}
                onChange={(e) =>
                  setTeacherData({
                    ...teacherData,
                    teachername: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white
                border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.teachername && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.teachername}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Teacher Code
              </label>
              <input
                type="text"
                value={teacherData.teachercode}
                onChange={(e) =>
                  setTeacherData({
                    ...teacherData,
                    teachercode: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white
                border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.teachercode && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.teachercode}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                User{" "}
              </label>
              <select
                value={teacherData.userId}
                onChange={(e) =>
                  setTeacherData({ ...teacherData, userId: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white
                border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Streams
              </label>
              {streams.map((stream) => (
                <div key={stream.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`stream-${stream.id}`}
                    value={stream.id}
                    checked={teacherData.streamIds.includes(stream.id)}
                    onChange={(e) => {
                      const selectedStreamIds = teacherData.streamIds.includes(
                        e.target.value,
                      )
                        ? teacherData.streamIds.filter(
                            (id) => id !== e.target.value,
                          )
                        : [...teacherData.streamIds, e.target.value];
                      setTeacherData({
                        ...teacherData,
                        streamIds: selectedStreamIds,
                      });
                    }}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`stream-${stream.id}`}
                    className="text-gray-300"
                  >
                    {stream.streamName}
                  </label>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {isSubmitting
                ? "Submitting..."
                : editTeacher
                  ? "Update Teacher"
                  : "Add Teacher"}
            </button>
          </form>
        </div>

        {/* Filtering Section */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 rounded-lg bg-gray-800
              text-white border border-gray-700 focus:outline-none
              focus:ring-2 focus:ring-indigo-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* User Filter */}
          <div className="relative">
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="w-full px-4 py-3 pl-10 rounded-lg bg-gray-800
              text-white border border-gray-700 focus:outline-none
              focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Filter by User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Stream Filter */}
          <div className="relative">
            <select
              value={filterStream}
              onChange={(e) => setFilterStream(e.target.value)}
              className="w-full px-4 py-3 pl-10 rounded-lg bg-gray-800
              text-white border border-gray-700 focus:outline-none
              focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Filter by Stream</option>
              {streams.map((stream) => (
                <option key={stream.id} value={stream.id}>
                  {stream.streamName}
                </option>
              ))}
            </select>
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Teacher List */}
        <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-700">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <FaChalkboardTeacher className="mr-3 text-indigo-400" />
              Teacher List
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Teacher Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Teacher Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Streams
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredTeachers.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className="hover:bg-gray-700 transition duration-300"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {teacher.teachername}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {teacher.teachercode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {users.find((user) => user.id === teacher.userId)?.name ||
                        ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {teacher.streams
                        ?.map((stream) => stream.streamName)
                        .join(", ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(teacher)}
                        className="text-blue-400 hover:text-blue-300 mr-4 transition duration-300"
                      >
                        <FaEdit className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleDelete(teacher.id)}
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

export default TeacherManagement;
