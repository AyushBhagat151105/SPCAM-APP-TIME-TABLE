// src/components/AuthConfigForm.tsx
"use client";
import React, { useState } from "react";

const AuthConfigForm = () => {
  const [defaultRole, setDefaultRole] = useState("admin");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/update-auth-config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        defaultRole,
      }),
    });

    if (response.ok) {
      alert("Configuration updated successfully");
    } else {
      alert("Failed to update configuration");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 m-6 bg-gray-800 rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label className="block text-gray-300 font-bold mb-2">
          Default Role:
        </label>
        <select
          value={defaultRole}
          onChange={(e) => setDefaultRole(e.target.value)}
          className="w-full p-2 bg-gray-700 text-gray-300 rounded-md"
        >
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition duration-200"
      >
        Update Configuration
      </button>
    </form>
  );
};

export default AuthConfigForm;
