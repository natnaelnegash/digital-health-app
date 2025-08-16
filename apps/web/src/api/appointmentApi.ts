import apiClient from "./axiosConfig";

export const getAppointments = async () => {
    const response = await apiClient.get('/appointment')
    return response.data
}
