import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchProvidersApi } from "../../api/userApi";

interface UserState {
    patients: any[]
    providers: any[]
    isLoading: boolean
    error:string | null
}

const initialState : UserState = {
    patients : [],
    providers : [],
    isLoading : false,
    error : null
}

export const fetchProviders = createAsyncThunk (
    'users/fetchUsers',
    async(_,{rejectWithValue}) => {
        try {
            const data = await fetchProvidersApi()
            return data
        } catch (error:any) {
            return rejectWithValue(error.response.data.message || 'Failed to fetch users')
        }
        
    }
)

// export const fetchPatients = createAsyncThunk (
//     'users/fetchUsers',
//     async(_,{rejectWithValue}) => {
//         try {
//             const data = await fetchPatientsApi()
//             return data
//         } catch (error:any) {
//             return rejectWithValue(error.response.data.message || 'Failed to fetch users')
//         }
        
//     }
// )

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers : {

    },
    extraReducers(builder) {
        builder
            .addCase(fetchProviders.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchProviders.fulfilled, (state, action) => {
                state.isLoading = false
                state.providers = action.payload
            })
            .addCase(fetchProviders.rejected, (state, action) => {
                state.isLoading =false
                state.error = action.payload as string
            })
    },
})

export default userSlice.reducer