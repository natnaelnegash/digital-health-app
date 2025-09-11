import apiClient from "./axiosConfig"

export const getMyPatientDetails = async (patientId: string) => {
    const response = await apiClient(`/patients/${patientId}`)
    return response.data
}