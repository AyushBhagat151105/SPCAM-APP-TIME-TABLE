"use client";

import { useState, useEffect } from "react";
import {
  FaChalkboardTeacher,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
} from "react-icons/fa";
import {
  createClass,
  deleteClass,
  fetchClasses,
  updateClass,
} from "@/app/action/classes/actions";

// Define a type for the errors state
type Errors = {
  classname?: string;
  classroom?: string;
};

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
  const [errors, setErrors] = useState<Errors>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch classes from the server
  const loadClasses = async () => {
    try {
      const data = await fetchClasses();
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
      alert("Failed to load classes.");
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  // Handle form submission for adding/updating a class
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("classname", classData.classname);
    formData.append("classroom", classData.classroom);

    if (editClass) {
      formData.append("id", editClass.id);
    }

    try {
      const response = editClass
        ? await updateClass(formData)
        : await createClass(formData);

      if (!response.success) {
        setErrors({ classname: response.message });
        return;
      }

      alert(response.message);
      setEditClass(null);
      setClassData({ classname: "", classroom: "" });
      loadClasses();
    } catch {
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete functionality
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;

    try {
      const response = await deleteClass(id);

      if (!response.success) {
        alert(response.message);
        return;
      }

      alert(response.message);
      loadClasses();
    } catch {
      alert("Failed to delete class.");
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
              <input
                type="text"
                value={classData.classname}
                onChange={(e) =>
                  setClassData({ ...classData, classname: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white"
              />
              {errors.classname && (
                <p className="text-sm text-red-400 mt-1">{errors.classname}</p>
              )}
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
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white"
              />
              {errors.classroom && (
                <p className="text-sm text-red-400 mt-1">{errors.classroom}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg"
            >
              {isSubmitting
                ? "Submitting..."
                : editClass
                  ? "Update Class"
                  : "Add Class"}
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
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Class List */}
        <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-700">
            <h2 className="text-2xl font-semibold text-white">Class List</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-300">
                    Class Name
                  </th>
                  <th className="px-6 py-3 text-left text-gray-300">
                    Classroom
                  </th>
                  <th className="px-6 py-3 text-left text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.map((classItem) => (
                  <tr key={classItem.id}>
                    <td className="px-6 py-4 text-white">
                      {classItem.classname}
                    </td>
                    <td className="px-6 py-4 text-white">
                      {classItem.classroom}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEdit(classItem)}
                        className="mr-4 text-blue-400"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(classItem.id)}
                        className="text-red-400"
                      >
                        <FaTrash />
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
