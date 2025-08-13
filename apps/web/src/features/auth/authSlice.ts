import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User { 
    id: string
    email: string
    role: string
}

interface AuthState {
    user: User | null
    token: string | null
    isLoading: boolean
    error: string | null
}

const token = localStorage.getItem('token')

const initialState: AuthState = {
    user: null,
    token: token,
    isLoading: false,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authStart(state) {
            state.isLoading = true
            state.error = null
        },

        authSuccess(state, action: PayloadAction<{user: User, token: string}>) {
            state.isLoading = false
            state.user = action.payload.user
            state.token = action.payload.token

            localStorage.setItem('token', action.payload.token)
        },

        authFailure(state, action: PayloadAction<string>) {
            state.isLoading = false
            state.error = action.payload
        },

        logout(state) {
            state.user = null
            state.token = null
            
            localStorage.removeItem('token')
        }
    }
})

export const {authStart, authSuccess, authFailure, logout} = authSlice.actions

export default authSlice.reducer