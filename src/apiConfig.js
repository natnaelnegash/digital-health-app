// src/apiConfig.js

// Use the Vite environment variable for API base URL
export const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
// You can change the above URL based on your environment (development, production, etc.)