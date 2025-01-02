// src/components/ClassManagement.tsx
"use client";
import { useState, useEffect } from "react";

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
      if (error instanceof Error) {
        console.error("Error fetching classes:", error);
        alert(`Error fetching classes: ${error.message}`);
      } else {
        console.error("Unknown error fetching classes");
        alert("Unknown error fetching classes");
      }
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
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("Unknown error occurred");
      }
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
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("Unknown error occurred");
      }
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

  return (
    <div className="bg-gray-900 text-white min-h-screen py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Class Management</h1>

      {/* Add/Edit Class Form */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8 max-w-lg mx-auto">
        <h2 className="text-2xl mb-4">
          {editClass ? "Edit Class" : "Add New Class"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Class Name</label>
            <input
              type="text"
              value={classData.classname}
              onChange={(e) =>
                setClassData({ ...classData, classname: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.classname && (
              <p className="text-sm text-red-400 mt-1">{errors.classname}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Classroom</label>
            <input
              type="text"
              value={classData.classroom}
              onChange={(e) =>
                setClassData({ ...classData, classroom: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.classroom && (
              <p className="text-sm text-red-400 mt-1">{errors.classroom}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isSubmitting
              ? "Submitting..."
              : editClass
                ? "Update Class"
                : "Add Class"}
          </button>
        </form>
      </div>

      {/* Class List */}
      <div className="overflow-x-auto bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Class List</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left border-b text-lg">
                Class Name
              </th>
              <th className="px-4 py-2 text-left border-b text-lg">
                Classroom
              </th>
              <th className="px-4 py-2 text-left border-b text-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((classItem) => (
              <tr key={classItem.id} className="border-b">
                <td className="px-4 py-2">{classItem.classname}</td>
                <td className="px-4 py-2">{classItem.classroom}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(classItem)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(classItem.id)}
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

export default ClassManagement;
