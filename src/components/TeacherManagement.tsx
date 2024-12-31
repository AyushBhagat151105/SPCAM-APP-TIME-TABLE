"use client";
import { useState, useEffect } from "react";

type Teacher = {
  id: string;
  teachername: string;
  teachercode: string;
};

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [teacherData, setTeacherData] = useState({
    teachername: "",
    teachercode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Fetch teachers from the backend
  const fetchTeachers = async () => {
    try {
      const res = await fetch("/api/teachers");
      if (!res.ok) {
        throw new Error("Failed to fetch teachers");
      }
      const data = await res.json();
      setTeachers(data.teachers);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching teachers:", error);
        alert(`Error fetching teachers: ${error.message}`);
      } else {
        console.error("Unknown error fetching teachers");
        alert("Unknown error fetching teachers");
      }
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Handle form submission for adding/updating a teacher
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
      setTeacherData({ teachername: "", teachercode: "" });
      fetchTeachers();
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
    if (confirm("Are you sure you want to delete this teacher?")) {
      try {
        const response = await fetch(`/api/teachers/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete teacher");
        }

        alert("Teacher deleted successfully");
        fetchTeachers();
      } catch (error) {
        if (error instanceof Error) {
          alert(`Error: ${error.message}`);
        } else {
          alert("Unknown error occurred");
        }
      }
    }
  };

  // Handle edit action
  const handleEdit = (teacher: Teacher) => {
    setEditTeacher(teacher);
    setTeacherData({
      teachername: teacher.teachername,
      teachercode: teacher.teachercode,
    });
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Teacher Management
      </h1>

      {/* Add/Edit Teacher Form */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8 max-w-lg mx-auto">
        <h2 className="text-2xl mb-4">
          {editTeacher ? "Edit Teacher" : "Add New Teacher"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Teacher Name
            </label>
            <input
              type="text"
              value={teacherData.teachername}
              onChange={(e) =>
                setTeacherData({ ...teacherData, teachername: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.teachername && (
              <p className="text-sm text-red-400 mt-1">{errors.teachername}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Teacher Code
            </label>
            <input
              type="text"
              value={teacherData.teachercode}
              onChange={(e) =>
                setTeacherData({ ...teacherData, teachercode: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.teachercode && (
              <p className="text-sm text-red-400 mt-1">{errors.teachercode}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isSubmitting
              ? "Submitting..."
              : editTeacher
                ? "Update Teacher"
                : "Add Teacher"}
          </button>
        </form>
      </div>

      {/* Teacher List */}
      <div className="overflow-x-auto bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Teacher List</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left border-b text-lg">
                Teacher Name
              </th>
              <th className="px-4 py-2 text-left border-b text-lg">
                Teacher Code
              </th>
              <th className="px-4 py-2 text-left border-b text-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="border-b">
                <td className="px-4 py-2">{teacher.teachername}</td>
                <td className="px-4 py-2">{teacher.teachercode}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(teacher)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(teacher.id)}
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

export default TeacherManagement;
