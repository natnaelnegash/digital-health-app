import apiClient from "./axiosConfig"

export const fetchProvidersApi = async () => {
    const users = await apiClient('/users/providers')
    return users.data
}

export const fetchPatientsApi = async () => {
    const users = await apiClient('/users/patients')
    return users.data
}
