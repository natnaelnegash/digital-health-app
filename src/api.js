import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // your backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: attach auth token if needed
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // store token on login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
