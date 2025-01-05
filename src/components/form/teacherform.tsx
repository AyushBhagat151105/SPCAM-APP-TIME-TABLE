"use client";
import { useState } from "react";

interface FormErrors {
  teachername?: string;
  teachercode?: string;
}

export const TeacherForm = () => {
  const [formData, setFormData] = useState({
    teachername: "",
    teachercode: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form data before submission
    if (!formData.teachername || !formData.teachercode) {
      setErrors({
        teachername: !formData.teachername ? "Teacher name is required" : "",
        teachercode: !formData.teachercode ? "Teacher code is required" : "",
      });
      setIsSubmitting(false);
      return;
    }

    // Log the form data to ensure it's not null
    console.log("Form Data:", formData);

    // Send the form data to the server
    const response = await fetch("/api/teachers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Teacher added successfully");
      setFormData({ teachername: "", teachercode: "" });
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-6">Add New Teacher</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Teacher Name</label>
          <input
            type="text"
            value={formData.teachername}
            onChange={(e) =>
              setFormData({ ...formData, teachername: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.teachername && (
            <p className="text-sm text-red-400 mt-1">{errors.teachername}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Teacher Code</label>
          <input
            type="text"
            value={formData.teachercode}
            onChange={(e) =>
              setFormData({ ...formData, teachercode: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          {isSubmitting ? "Submitting..." : "Add Teacher"}
        </button>
      </form>
    </div>
  );
};
