import apiClient from "./axiosConfig";

export const register = async (userData: any) => {
    
    const response = await apiClient.post(`auth/register`, userData)
    return response.data
}

export const login = async (userData: any) => {
    
    const response = await apiClient.post(`auth/login`, userData)
    return response.data
}