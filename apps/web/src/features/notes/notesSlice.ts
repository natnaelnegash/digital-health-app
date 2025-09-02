// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { getNotes } from "../../api/noteApi";

// interface NoteState {
//     notes: any[]
//     isLoading: boolean
//     error: string | null
// }

// const initialState: NoteState = {
//     notes: [],
//     isLoading: false,
//     error: null
// }

// const fetchUserNotes = createAsyncThunk(
//     'notes/fetchUserNotes',
//     async(_, {rejectWithValue}) => {
//         try {
//             const data = await getNotes
//         } catch (error) {
            
//         }
//     }
// )

// const notesSlice = createSlice({
//     name: 'notes',
//     initialState,
//     reducers: {},
//     extraReducers(builder) {
//         builder
//             .addCase()
//     },
// })