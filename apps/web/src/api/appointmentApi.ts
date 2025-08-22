import apiClient from "./axiosConfig";

export const getAppointments = async () => {
    const response = await apiClient.get('/appointments')
    return response.data
}

export const createAppointment = async (appointmentData: {providerId: string; startTime: string; reason?: string }) => {
    const response = await apiClient.post('/appointments', appointmentData)
    return response.data
}

export const cancelAppointment = async(appointmentId : string) => {
    const response = await apiClient.patch(`/appointments/${appointmentId}/cancel`)
    return response.data
}