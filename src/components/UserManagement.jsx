"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../apiConfig"; // Make sure this file exports your backend URL

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "PATIENT",
    status: "Active",
    phone: "",
    password: "", // Added password field
  });
  const [loading, setLoading] = useState(true);

  // Fetch users from backend
  const fetchUsers = async () => {
  try {
    setLoading(true);
    const res = await axios.get(`${API_URL}/users`);
    const formattedUsers = res.data.users.map((u) => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role,
      status: u.isActive ? "Active" : "Inactive",
      phone: u.phone || "",
    }));
    setUsers(formattedUsers);
    setLoading(false);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    setLoading(false);
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      role: "PATIENT",
      status: "Active",
      phone: "",
      password: "",
    });
    setShowAddForm(false);
    setEditingUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
        password: formData.password || "defaultPass123", // Send password
      };
      await axios.post(`${API_URL}/users`, payload);
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error("Add user error:", error);
      alert(error.response?.data?.error || "Failed to add user");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user.id);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone,
      password: "", // Do not fill password on edit
    });
    setShowAddForm(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const payload = {
  firstName: formData.firstName,
  lastName: formData.lastName,
  email: formData.email,  // include this
  phone: formData.phone,
  role: formData.role,
  isActive: formData.status === "Active",
};
      await axios.put(`${API_URL}/users/${editingUser}`, payload);
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error("Update user error:", error);
      alert(error.response?.data?.error || "Failed to update user");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API_URL}/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error("Delete user error:", error);
      alert(error.response?.data?.error || "Failed to delete user");
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const payload = { isActive: user.status === "Inactive" };
      await axios.put(`${API_URL}/users/${user.id}`, payload);
      fetchUsers();
    } catch (error) {
      console.error("Toggle status error:", error);
      alert(error.response?.data?.error || "Failed to toggle status");
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          + Add New User
        </button>
      </div>

      {(showAddForm || editingUser) && (
        <div className="mb-6 p-4 border border-gray-200 rounded-xl bg-gray-50">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            {editingUser ? "Edit User" : "Add New User"}
          </h3>
          <form
            onSubmit={editingUser ? handleUpdateUser : handleAddUser}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {["firstName", "lastName", "email", "role", "status", "phone"].map(
              (field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    {["firstName", "lastName", "email"].includes(field) ? " *" : ""}
                  </label>
                  {field === "role" || field === "status" ? (
                    <select
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {field === "role" &&
                        ["PATIENT", "PROVIDER", "ADMIN"].map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      {field === "status" &&
                        ["Active", "Inactive"].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      required={["firstName", "lastName", "email"].includes(field)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              )
            )}

            {/* Password field */}
            {!editingUser && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            )}

            <div className="md:col-span-2 flex space-x-3">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                {editingUser ? "Update User" : "Add User"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading users...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                {["ID", "Name", "Email", "Role", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(user)}
                      className={`transition-colors duration-150 ${
                        user.status === "Active"
                          ? "text-orange-600 hover:text-orange-900"
                          : "text-green-600 hover:text-green-900"
                      }`}
                    >
                      {user.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900 transition-colors duration-150"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No users found. Click "Add New User" to get started.
        </div>
      )}
    </div>
  );
};

export default UserManagement;
