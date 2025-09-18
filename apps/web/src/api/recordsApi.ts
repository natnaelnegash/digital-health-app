// src/api/recordsApi.ts
import apiClient from './axiosConfig';

export const getRecordsForPatient = async (patientId: string) => {
  
  const response = await apiClient.get(`/patients/${patientId}/records`);
  
  return response.data;
};

export const createRecord = async (patientId: string, recordData: any) => {
  // The recordData will have a 'type' and 'data' field, matching our backend controller
  const response = await apiClient.post(`/patients/${patientId}/records`, recordData);
  return response.data;
};