"use client";
import { useState, useEffect } from "react";

type Teacher = {
  id: string; // Ensure the id type matches the backend expectations
  teachername: string;
  teachercode: string;
};

export const TeacherList = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [teacherData, setTeacherData] = useState({
    teachername: "",
    teachercode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch teachers from the backend
  const fetchTeachers = async () => {
    try {
      const res = await fetch("/api/teachers");
      if (!res.ok) {
        throw new Error("Failed to fetch teachers");
      }
      const data = await res.json();
      console.log("Fetched Teachers:", data.teachers); // Log the fetched teachers
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

  // Handle form submission for updating a teacher
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!editTeacher?.id) {
        throw new Error("No teacher selected for editing");
      }

      const response = await fetch(`/api/teachers/${editTeacher.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teacherData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update teacher");
      }

      alert("Teacher updated successfully");
      setEditTeacher(null);
      setTeacherData({ teachername: "", teachercode: "" });
      fetchTeachers(); // Refresh the list
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
        fetchTeachers(); // Refresh the list
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
      <h1 className="text-3xl font-bold text-center mb-8">Teachers</h1>

      {/* Edit Teacher Form */}
      {editTeacher && (
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-2xl mb-4">Edit Teacher</h2>
          <form onSubmit={handleSubmit}>
            <label className="block text-lg mb-2">
              Teacher Name
              <input
                type="text"
                value={teacherData.teachername}
                onChange={(e) =>
                  setTeacherData({
                    ...teacherData,
                    teachername: e.target.value,
                  })
                }
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
            </label>

            <label className="block text-lg mb-2">
              Teacher Code
              <input
                type="text"
                value={teacherData.teachercode}
                onChange={(e) =>
                  setTeacherData({
                    ...teacherData,
                    teachercode: e.target.value,
                  })
                }
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isSubmitting ? "Updating..." : "Update Teacher"}
            </button>
          </form>
        </div>
      )}

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
