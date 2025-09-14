import apiClient from "./axiosConfig";

// const API_URL = process.env.API_URL || 'http://localhost:4000';

export const register = async (userData: any) => {
    
    const response = await apiClient.post(`http://localhost:4000/api/auth/register`, userData)
    // console.log("res data:", response)
    return response.data
}

export const login = async (userData: any) => {
    try{
        const response = await apiClient.post(`http://localhost:4000/api/auth/login`, userData);
        // console.log("API_URL:", API_URL);
        // console.log("userData:", userData);
        return response.data
    } catch (err){
        console.error("Login error:", err);
        return { error: 'Login failed', message: err instanceof Error ? err.message : String(err) };
    }

}