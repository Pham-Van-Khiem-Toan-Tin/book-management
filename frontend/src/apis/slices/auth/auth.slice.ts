import { createSlice } from "@reduxjs/toolkit";
import { baseProfile } from "../../actions/auth.action";


interface AuthState {
    success: boolean,
    message: string | null,
    loading: boolean,
    name: string | null,
    roles: Array<string>,
    avatar: string | null
};

const initialState: AuthState = {
    success: false as boolean,
    message: null,
    loading: false as boolean,
    name: null,
    roles: [],
    avatar: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(baseProfile.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(baseProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.name = action.payload.name;
            state.roles = action.payload.roles;
            state.avatar = action.payload.avatar;
        });
        builder.addCase(baseProfile.rejected, (state) => {
            state.loading = false;
        })
    }
});
export default authSlice.reducer;