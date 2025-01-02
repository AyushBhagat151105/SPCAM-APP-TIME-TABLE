// src/components/ClassManagement.tsx
"use client";
import { useState, useEffect } from "react";
import {
  FaChalkboardTeacher,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
} from "react-icons/fa";

const ClassManagement = () => {
  type Class = {
    id: string;
    classname: string;
    classroom: string;
  };

  const [classes, setClasses] = useState<Class[]>([]);
  const [editClass, setEditClass] = useState<Class | null>(null);
  const [classData, setClassData] = useState({
    classname: "",
    classroom: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch classes from the backend
  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/classes", { method: "GET" });
      if (!res.ok) {
        throw new Error("Failed to fetch classes");
      }
      const data = await res.json();
      setClasses(data.classes);
    } catch (error) {
      console.error("Error fetching classes:", error);
      alert(
        `Error fetching classes: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Handle form submission for adding/updating a class
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!classData.classname || !classData.classroom) {
      setErrors({
        classname: !classData.classname ? "Class name is required" : "",
        classroom: !classData.classroom ? "Classroom is required" : "",
      });
      setIsSubmitting(false);
      return;
    }

    const method = editClass ? "PUT" : "POST";
    const url = editClass ? `/api/classes/${editClass.id}` : "/api/classes";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(classData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save class");
      }

      alert(`Class ${editClass ? "updated" : "added"} successfully`);
      setEditClass(null);
      setClassData({ classname: "", classroom: "" });
      fetchClasses();
    } catch (error) {
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle the delete functionality
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;

    try {
      const response = await fetch(`/api/classes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete class");
      }

      alert("Class deleted successfully.");
      fetchClasses();
    } catch (error) {
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  // Handle edit action
  const handleEdit = (classItem: Class) => {
    setEditClass(classItem);
    setClassData({
      classname: classItem.classname,
      classroom: classItem.classroom,
    });
  };

  // Filter classes based on search term
  const filteredClasses = classes.filter(
    (classItem) =>
      classItem.classname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.classroom.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-center mb-10">
          <FaChalkboardTeacher className="text-4xl text-indigo-400 mr-4" />
          <h1 className="text-4xl font-bold text-white">Class Management</h1>
        </div>

        {/* Add/Edit Class Form */}
        <div className="bg-gray-800 shadow-xl rounded-lg p-8 mb-10">
          <div className="flex items-center mb-6">
            <FaPlus className="text-2xl text-indigo-400 mr-3" />
            <h2 className="text-2xl font-semibold text-white">
              {editClass ? "Edit Class" : "Add New Class"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Class Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={classData.classname}
                  onChange={(e) =>
                    setClassData({ ...classData, classname: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white
                  border border-transparent focus:outline-none focus:ring-2
                  focus:ring-indigo-500 transition duration-300"
                />
                {errors.classname && (
                  <p className="text-sm text-red-400 mt-1">
                    {errors.classname}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Classroom
              </label>
              <input
                type="text"
                value={classData.classroom}
                onChange={(e) =>
                  setClassData({ ...classData, classroom: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white
                border border-transparent focus:outline-none focus:ring-2
                focus:ring-indigo-500 transition duration-300"
              />
              {errors.classroom && (
                <p className="text-sm text-red-400 mt-1">{errors.classroom}</p>
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
                <span>Submitting...</span>
              ) : editClass ? (
                <>
                  <FaEdit className="mr-2" /> Update Class
                </>
              ) : (
                <>
                  <FaPlus className="mr-2" /> Add Class
                </>
              )}
            </button>
          </form>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 rounded-lg bg-gray-800
            text-white border border-gray-700 focus:outline-none
             focus:ring-2 focus:ring-indigo-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Class List */}
        <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-700">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <FaChalkboardTeacher className="mr-3 text-indigo-400" />
              Class List
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Class Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Classroom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredClasses.map((classItem) => (
                  <tr
                    key={classItem.id}
                    className="hover:bg-gray-700 transition duration-300"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {classItem.classname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {classItem.classroom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(classItem)}
                        className="text-blue-400 hover:text-blue-300 mr-4 transition duration-300"
                      >
                        <FaEdit className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleDelete(classItem.id)}
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

export default ClassManagement;
