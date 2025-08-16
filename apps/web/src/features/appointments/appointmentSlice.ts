import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAppointments } from "../../api/appointmentApi";

interface AppointmentState {
    appointments: any[]
    isLoading: boolean
    error: string | null
}

const initialState: AppointmentState = {
    appointments: [],
    isLoading: false,
    error: null
}

export const fetchAppointments = createAsyncThunk(
    'appointments/fetchAppointments',
    async(_, {rejectWithValue}) => {
        try {
            const data = await getAppointments()
            return data
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "Failed to fetch appointments")
        }
    }
)

const appointmentSlice = createSlice({
    name: 'appointment',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchAppointments.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchAppointments.fulfilled, (state, action) => {
                state.isLoading = false
                state.appointments = action.payload
            })
            .addCase(fetchAppointments.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    },
})

export default appointmentSlice.reducer