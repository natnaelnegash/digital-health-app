import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
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

// export const createAppointment = createAsyncThunk(
//     'appointments/createAppointment',
//     async(_, {regectWithValue}) => {
//         try {
//             const data = await createAppointment()
//             return data
//         } catch (error: any) {
//             return regectWithValue(error.response.data.message || 'Failed to book an appointment ')
//         }
//     }
// )

const appointmentSlice = createSlice({
    name: 'appointment',
    initialState,
    reducers: {
        appointmentStart(state) {
            state.isLoading = true
            state.error = null
        },

        appointmentSuccess(state) {
            state.isLoading = false
        },

        appointmentFailure(state, action:PayloadAction<string>) {
            state.isLoading = false
            state.error = action.payload
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
    },
})

export const {appointmentStart, appointmentSuccess, appointmentFailure} = appointmentSlice.actions
export default appointmentSlice.reducer