// src/features/patients/patientSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMyPatientDetails as getPatientDetailsApi } from '../../api/patientApi';
import { getRecordsForPatient as getRecordsApi, createRecord as createRecordApi } from '../../api/recordsApi';

interface PatientState {
  details: any | null;
  records: any | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  details: null,
  records: null,
  isLoading: false,
  error: null,
};

// Thunk to fetch ALL data for the page
export const fetchPatientPageData = createAsyncThunk(
  'patient/fetchPageData',
  async (patientId: string, { rejectWithValue }) => {
    try {
      const [details, records] = await Promise.all([
        getPatientDetailsApi(patientId),
        getRecordsApi(patientId)
      ]);
      
      return { details, records };
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

// Thunk to create a new record
export const createNewRecord = createAsyncThunk(
  'patient/createRecord',
  async ({ patientId, recordData }: { patientId: string, recordData: any }, { dispatch, rejectWithValue }) => {
    try {
       const updatedRecords = await createRecordApi(patientId, recordData);
      return updatedRecords;
      // await createRecordApi(patientId, recordData);
      // // On success, dispatch the fetch action again to get the latest data
      // dispatch(fetchPatientPageData(patientId));
      // return;
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientPageData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPatientPageData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.details = action.payload.details;
        state.records = action.payload.records;
        // console.log(state.records);
        
        state.error = null;
      })
      .addCase(fetchPatientPageData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createNewRecord.fulfilled, (state, action) => {
        // The payload (action.payload) is now the complete, updated records object.
        // We can directly replace our state with this new data.
        state.records = action.payload;
        state.error = null; // Clear any previous errors
      })
      .addCase(createNewRecord.pending, (state) => {
        // Can add a specific loading state for the form if needed
      })
      .addCase(createNewRecord.rejected, (state, action) => {
        // Can add a specific error state for the form if needed
        state.error = action.payload as string;
      });
  },
});

export default patientSlice.reducer;