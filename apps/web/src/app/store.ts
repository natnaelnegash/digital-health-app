import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice'
import appointmentReducer from '../features/appointments/appointmentSlice'
import userReducer from '../features/users/userSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        appointments: appointmentReducer,
        users: userReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch