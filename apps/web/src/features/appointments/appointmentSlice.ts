import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";
import { getAppointments, createAppointment as createAppointmentApi, cancelAppointment as cancelAppointmentApi, getAppointmentById } from "../../api/appointmentApi";
import { getNotes as getNotesApi, saveNotes as saveNotesApi } from "../../api/noteApi";

interface AppointmentState {
    appointments: any[]
    selectedAppointment: any | null
    isLoading: boolean
    error: string | null
}

const initialState: AppointmentState = {
    appointments: [],
    selectedAppointment: null,
    isLoading: false,
    error: null
}

export const fetchAppointmentDetails = createAsyncThunk(
    'appointments/fetchAppointmentDetails',
    async(appointmentId: string, {rejectWithValue}) => {
        try {
            const [appointment, note] = await Promise.all([getAppointmentById(appointmentId), getNotesApi(appointmentId)])
            return {...appointment, clinicalNote: note}
        } catch (error: any) {
            return error.message || 'Failed to fetch appointment details'
        }
    }
)

export const saveAppointmentNote = createAsyncThunk(
    'appointments/saveAppointmentNote',
    async({appointmentId, content}: {appointmentId: string, content: string}, {rejectWithValue}) => {
        try {
            const updatedNote = await saveNotesApi(appointmentId, content)
            return updatedNote
        } catch (error: any) {
            return error.message || 'Failed to fetch appointment details'
        }
    }
)

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
        clearSelectedAppointment(state) {
            state.selectedAppointment = null
        }
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
            .addCase(fetchAppointmentDetails.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchAppointmentDetails.fulfilled, (state, action) => {
                state.isLoading = false
                state.selectedAppointment = action.payload
            })
            .addCase(fetchAppointmentDetails.rejected, (state, action) => {
                state.isLoading = true
                state.error = action.payload as string
            })
            .addCase(saveAppointmentNote.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(saveAppointmentNote.fulfilled, (state, action) => {
                state.isLoading = false
                if (state.selectedAppointment) {
                    state.selectedAppointment.clinicalNote = action.payload
                }
            })
            .addCase(saveAppointmentNote.rejected, (state, action) => {
                state.isLoading = true
                state.error = action.payload as string
            })
    },
})

export const {clearSelectedAppointment} = appointmentSlice.actions
export default appointmentSlice.reducer