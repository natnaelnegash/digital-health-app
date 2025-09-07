// src/services/api.ts
import axios from 'axios';

// Replace this with your backend URL
const API_BASE_URL = 'http://localhost:5000';

// ------------------------- Users API -------------------------

// Fetch all users
export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Add a new user
export const addUser = async (user: { name: string; email: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, user);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

// Update a user by ID
export const updateUser = async (id: string, user: { name?: string; email?: string }) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${id}`, user);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

// Delete a user by ID
export const deleteUser = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};

// ------------------------- Reports API -------------------------

// Fetch report data
export const fetchReportData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reports`);
    return response.data;
  } catch (error) {
    console.error('Error fetching report data:', error);
    throw error;
  }
};
