import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { getAppointments, createAppointment as createAppointmentApi, cancelAppointment as cancelAppointmentApi } from "../../api/appointmentApi";

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

export const createAppointment = createAsyncThunk(
    'appointments/createAppointment',
    async(appointmentData: {providerId: string, startTime: string, reason? : string}, {rejectWithValue}) => {
        try {
            const data = await createAppointmentApi(appointmentData)
            return data
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || 'Failed to book an appointment ')
        }
    }
)

export const cancelAppointment = createAsyncThunk(
    'appointments/cancelAppointment',
    async(appointmentId:string , {rejectWithValue}) => {
        try {
            const data = await cancelAppointmentApi(appointmentId)
            return data
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || 'Failed to cancel appointment ')
        }
    }
)


const appointmentSlice = createSlice({
    name: 'appointment',
    initialState,
    reducers: {
        // appointmentStart(state) {
        //     state.isLoading = true
        //     state.error = null
        // },

        // appointmentSuccess(state) {
        //     state.isLoading = false
        // },

        // appointmentFailure(state, action:PayloadAction<string>) {
        //     state.isLoading = false
        //     state.error = action.payload
        // }
    },
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
            .addCase(createAppointment.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(createAppointment.fulfilled, (state, action) => {
                state.isLoading = false
                state.appointments.push(action.payload)
            })
            .addCase(createAppointment.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            .addCase(cancelAppointment.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(cancelAppointment.fulfilled, (state, action) => {
                state.isLoading = false
                const index = state.appointments.findIndex((appt) => appt.id === action.payload.id)
                if (index !== -1) {
                    state.appointments[index] = action.payload
                }
            })
            .addCase(cancelAppointment.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string 
            })
    },
})

// export const {appointmentStart, appointmentSuccess, appointmentFailure} = appointmentSlice.actions
export default appointmentSlice.reducer