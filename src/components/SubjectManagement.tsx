"use client";
import { useState, useEffect } from "react";

type Subject = {
  id: string;
  subjectname: string;
  subjectcode: string;
};

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const [subjectData, setSubjectData] = useState({
    subjectname: "",
    subjectcode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Fetch subjects from the backend
  const fetchSubjects = async () => {
    try {
      const res = await fetch("/api/subjects");
      if (!res.ok) {
        throw new Error("Failed to fetch subjects");
      }
      const data = await res.json();
      setSubjects(data.subjects);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching subjects:", error);
        alert(`Error fetching subjects: ${error.message}`);
      } else {
        console.error("Unknown error fetching subjects");
        alert("Unknown error fetching subjects");
      }
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Handle form submission for adding/updating a subject
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!subjectData.subjectname || !subjectData.subjectcode) {
      setErrors({
        subjectname: !subjectData.subjectname ? "Subject name is required" : "",
        subjectcode: !subjectData.subjectcode ? "Subject code is required" : "",
      });
      setIsSubmitting(false);
      return;
    }

    const method = editSubject ? "PUT" : "POST";
    const url = editSubject
      ? `/api/subjects/${editSubject.id}`
      : "/api/subjects";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subjectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save subject");
      }

      alert(`Subject ${editSubject ? "updated" : "added"} successfully`);
      setEditSubject(null);
      setSubjectData({ subjectname: "", subjectcode: "" });
      fetchSubjects();
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
    if (confirm("Are you sure you want to delete this subject?")) {
      try {
        const response = await fetch(`/api/subjects/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete subject");
        }

        alert("Subject deleted successfully");
        fetchSubjects();
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
  const handleEdit = (subject: Subject) => {
    setEditSubject(subject);
    setSubjectData({
      subjectname: subject.subjectname,
      subjectcode: subject.subjectcode,
    });
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Subject Management
      </h1>

      {/* Add/Edit Subject Form */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8 max-w-lg mx-auto">
        <h2 className="text-2xl mb-4">
          {editSubject ? "Edit Subject" : "Add New Subject"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Subject Name
            </label>
            <input
              type="text"
              value={subjectData.subjectname}
              onChange={(e) =>
                setSubjectData({ ...subjectData, subjectname: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.subjectname && (
              <p className="text-sm text-red-400 mt-1">{errors.subjectname}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Subject Code
            </label>
            <input
              type="text"
              value={subjectData.subjectcode}
              onChange={(e) =>
                setSubjectData({ ...subjectData, subjectcode: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.subjectcode && (
              <p className="text-sm text-red-400 mt-1">{errors.subjectcode}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isSubmitting
              ? "Submitting..."
              : editSubject
                ? "Update Subject"
                : "Add Subject"}
          </button>
        </form>
      </div>

      {/* Subject List */}
      <div className="overflow-x-auto bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Subject List</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left border-b text-lg">
                Subject Name
              </th>
              <th className="px-4 py-2 text-left border-b text-lg">
                Subject Code
              </th>
              <th className="px-4 py-2 text-left border-b text-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.id} className="border-b">
                <td className="px-4 py-2">{subject.subjectname}</td>
                <td className="px-4 py-2">{subject.subjectcode}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(subject)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(subject.id)}
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

export default SubjectManagement;
