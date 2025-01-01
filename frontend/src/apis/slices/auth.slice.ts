import { createSlice } from "@reduxjs/toolkit";
import { baseProfile } from "../actions/auth.action";


interface AuthState {
    success: boolean,
    message: string | null,
    loading: boolean,
    sub: string | null,
    order: number,
    library: string | null,
    name: string | null,
    roles: Array<string>,
    avatar: string | null
};

const initialState: AuthState = {
    success: false as boolean,
    message: null,
    loading: false as boolean,
    order: 0,
    name: null,
    sub: null,
    library: null,
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
            state.order = action.payload.order;
            state.sub = action.payload.sub;
            state.library = action.payload.library;
        });
        builder.addCase(baseProfile.rejected, (state) => {
            state.loading = false;
        })
    }
});
export default authSlice.reducer;