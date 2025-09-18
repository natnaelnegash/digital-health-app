import apiClient from "./axiosConfig";

export const getNotes = async (appointmentId: string) => {
    const response = await apiClient.get(`/appointments/${appointmentId}/note`)
    return response.data
}

export const saveNotes = async (appointmentId: string, content: string ) => {
    const response = await apiClient.post(`/appointments/${appointmentId}/note`, {content})
    return response.data
}