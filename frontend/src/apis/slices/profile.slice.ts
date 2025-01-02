import { createSlice } from "@reduxjs/toolkit";
import { editProfile, Profile, viewProfile } from "../actions/profile.action";

interface ProfileState {
    success: boolean,
    message: string | null,
    loading: boolean,
    error: boolean,
    profile: Profile | null,
}

const initialState: ProfileState = {
    success: false as boolean,
    message: null,
    loading: false as boolean,
    error: false as boolean,
    profile: null,
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        resetError: (state) => {
            state.error = false;
            state.message = null;
        },
        reset: (state) => {
            state.message = null;
            state.success = false;
            state.profile = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(viewProfile.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(viewProfile.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.profile = payload.user;
        });
        builder.addCase(viewProfile.rejected, (state) => {
            state.loading = false;
            state.error = true;
        });
        builder.addCase(editProfile.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(editProfile.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.success = payload.success;
            state.message = payload.message;
        });
        builder.addCase(editProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = true;
            state.message = action.payload as string;
        });
    },
});

export const { resetError, reset } = profileSlice.actions;
export default profileSlice.reducer;