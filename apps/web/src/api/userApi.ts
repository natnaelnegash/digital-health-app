import apiClient from "./axiosConfig"

export const fetchProviderById = async (providerId: string) => {
    const response = await apiClient(`/users/provider/${providerId}`)
    return response.data
}

export const fetchProvidersApi = async () => {
    const response = await apiClient('/users/providers')
    return response.data
}

export const fetchPatientsApi = async () => {
    const response = await apiClient('/users/patients')
    return response.data
}

export const fetchMyProfile = async () => {
    const response = await apiClient.get('/users/my-profile')
    return response.data
}

export const updateMyProfile = async (profileData: {firstname?:string, lastname?:string}) => {
    const response = await apiClient.patch('/users/update-profile', profileData)
    return response.data
}