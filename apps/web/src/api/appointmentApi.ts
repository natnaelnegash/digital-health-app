import apiClient from "./axiosConfig";

export const getAppointments = async () => {
    const response = await apiClient.get('/appointments')
    return response.data
}

export const createAppointment = async (appointmentData: any) => {
    const response = await apiClient.post('/appointments', appointmentData)
    return response.data
}