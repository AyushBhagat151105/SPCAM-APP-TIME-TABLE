"use client";

import { useState, useEffect } from "react";
import { FaBook, FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import {
  createSubject,
  deleteSubject,
  getSubjects,
  updateSubject,
} from "@/app/action/subject/action";
import { getClasses } from "@/app/action/classes/actions";
import { toast } from "@/hooks/use-toast";

type Subject = {
  id: string;
  subjectname: string;
  subjectcode: string;
  classId?: string | null;
};

type Class = {
  id: string;
  classname: string;
};

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const [subjectData, setSubjectData] = useState({
    subjectname: "",
    subjectcode: "",
    classId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch subjects from the backend
  const fetchSubjects = async () => {
    const response = await getSubjects();
    if (response.success && Array.isArray(response.subjects)) {
      setSubjects(response.subjects);
    } else {
      console.error(response.error);
      toast({
        variant: "destructive",
        title: response.error || "Failed to fetch subjects.",
      });
    }
  };

  // Fetch classes from the backend
  const fetchClasses = async () => {
    const response = await getClasses();
    if (response.success && Array.isArray(response.classes)) {
      setClasses(response.classes);
    } else {
      console.error(response.error);
      toast({
        variant: "destructive",
        title: response.error || "Failed to fetch classes.",
      });
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchClasses();
  }, []);

  // Handle input changes with explicit type casting
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: "subjectname" | "subjectcode" | "classId",
  ) => {
    setSubjectData({
      ...subjectData,
      [field]: e.target.value,
    });
  };

  // Handle form submission for adding/updating a subject
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validate inputs
    if (!subjectData.subjectname || !subjectData.subjectcode) {
      setErrors({
        subjectname: !subjectData.subjectname ? "Subject name is required" : "",
        subjectcode: !subjectData.subjectcode ? "Subject code is required" : "",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      let response;
      const formData = new FormData();
      formData.append("subjectname", subjectData.subjectname);
      formData.append("subjectcode", subjectData.subjectcode);
      formData.append("classId", subjectData.classId);

      if (editSubject) {
        response = await updateSubject(editSubject.id, formData);
      } else {
        response = await createSubject(formData);
      }

      if (response.success) {
        toast({
          title: `Subject ${editSubject ? "updated" : "added"} successfully`,
        });
        setEditSubject(null);
        setSubjectData({ subjectname: "", subjectcode: "", classId: "" });
        fetchSubjects();
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setErrors({ form: response.error });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Failed to save subject. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle the delete functionality
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;

    const response = await deleteSubject(id);
    if (response.success) {
      toast({
        title: "Subject deleted successfully.",
      });
      fetchSubjects();
    } else {
      toast({
        variant: "destructive",
        title: response.error || "Failed to delete subject.",
      });
    }
  };

  // Handle edit action
  const handleEdit = (subject: Subject) => {
    setEditSubject(subject);
    setSubjectData({
      subjectname: subject.subjectname,
      subjectcode: subject.subjectcode,
      classId: subject.classId || "",
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
                onChange={(e) => handleInputChange(e, "subjectname")}
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
                onChange={(e) => handleInputChange(e, "subjectcode")}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white
                border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.subjectcode && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.subjectcode}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Class
              </label>
              <select
                value={subjectData.classId}
                onChange={(e) => handleInputChange(e, "classId")}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white
                border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.classname}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700
              text-white rounded-lg font-semibold transition duration-300
              transform hover:scale-105 focus:outline-none focus:ring-2
              focus:ring-indigo-500 flex items-center justify-center"
            >
              {isSubmitting
                ? "Submitting..."
                : editSubject
                  ? "Update Subject"
                  : "Add Subject"}
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
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-white">
                {filteredSubjects.length > 0 ? (
                  filteredSubjects.map((subject) => (
                    <tr key={subject.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4">{subject.subjectname}</td>
                      <td className="px-6 py-4">{subject.subjectcode}</td>
                      <td className="px-6 py-4">
                        {classes.find((cls) => cls.id === subject.classId)
                          ?.classname || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEdit(subject)}
                          className="text-indigo-400 hover:text-indigo-500"
                        >
                          <FaEdit className="inline mr-2" />
                        </button>
                        <button
                          onClick={() => handleDelete(subject.id)}
                          className="text-red-500 hover:text-red-600 ml-4"
                        >
                          <FaTrash className="inline mr-2" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">
                      No subjects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectManagement;
