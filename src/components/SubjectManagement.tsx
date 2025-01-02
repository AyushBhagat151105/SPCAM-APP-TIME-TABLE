"use client";
import { useState, useEffect } from "react";
import { FaBook, FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");

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
      console.error("Error fetching subjects:", error);
      alert(
        `Error fetching subjects: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
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
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle the delete functionality
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;

    try {
      const response = await fetch(`/api/subjects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete subject");
      }

      alert("Subject deleted successfully.");
      fetchSubjects();
    } catch (error) {
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
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

  // Filter subjects based on search term
  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.subjectname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.subjectcode.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-center mb-10">
          <FaBook className="text-4xl text-indigo-400 mr-4" />
          <h1 className="text-4xl font-bold text-white">Subject Management</h1>
        </div>

        {/* Add/Edit Subject Form */}
        <div className="bg-gray-800 shadow-xl rounded-lg p-8 mb-10">
          <div className="flex items-center mb-6">
            <FaPlus className="text-2xl text-indigo-400 mr-3" />
            <h2 className="text-2xl font-semibold text-white">
              {editSubject ? "Edit Subject" : "Add New Subject"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject Name
              </label>
              <input
                type="text"
                value={subjectData.subjectname}
                onChange={(e) =>
                  setSubjectData({
                    ...subjectData,
                    subjectname: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white
                border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.subjectname && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.subjectname}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject Code
              </label>
              <input
                type="text"
                value={subjectData.subjectcode}
                onChange={(e) =>
                  setSubjectData({
                    ...subjectData,
                    subjectcode: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white
                border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.subjectcode && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.subjectcode}
                </p>
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
              ) : editSubject ? (
                <>
                  <FaEdit className="mr-2" /> Update Subject
                </>
              ) : (
                <>
                  <FaPlus className="mr-2" /> Add Subject
                </>
              )}
            </button>
          </form>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 rounded-lg bg-gray-800
            text-white border border-gray-700 focus:outline-none
            focus:ring-2 focus:ring-indigo-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y -1/2 text-gray-400" />
        </div>

        {/* Subject List */}
        <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-700">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <FaBook className="mr-3 text-indigo-400" />
              Subject List
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Subject Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Subject Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredSubjects.map((subject) => (
                  <tr
                    key={subject.id}
                    className="hover:bg-gray-700 transition duration-300"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {subject.subjectname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {subject.subjectcode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(subject)}
                        className="text-blue-400 hover:text-blue-300 mr-4 transition duration-300"
                      >
                        <FaEdit className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleDelete(subject.id)}
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

export default SubjectManagement;
