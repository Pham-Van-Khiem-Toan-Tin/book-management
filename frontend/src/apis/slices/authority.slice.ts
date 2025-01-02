import { createSlice } from "@reduxjs/toolkit";
import { allAuthorities, Authority, AuthorityDetail, editAuthority, viewAuthority } from "../actions/authorities.action";

interface AuthorityState {
    success: boolean,
    message: string | null,
    loading: boolean,
    error: boolean,
    authorities: Array<Authority>,
    authority: AuthorityDetail | null,
    pagination: {
        total: number,
        page: number,
        limit: number,
        totalPages: number,
    }
};

const initialState: AuthorityState = {
    success: false as boolean,
    message: null,
    loading: false as boolean,
    error: false as boolean,
    authority: null,
    authorities: [],
    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    }
};

const authoritySlice = createSlice({
    name: "authority",
    initialState,
    reducers: {
        resetError: (state) => {
            state.error = false;
            state.message = null;
        },
        reset: (state) => {
            state.message = null;
            state.success = false;
            state.authority = null;
            state.authorities = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(allAuthorities.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(allAuthorities.fulfilled, (state, action) => {
            state.loading = false;
            state.authorities = action.payload.authorities;
            state.pagination = action.payload.pagination;
        });
        builder.addCase(allAuthorities.rejected, (state, action) => {
            state.loading = false;
            state.message = action.payload as string;
        });
        builder.addCase(viewAuthority.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(viewAuthority.fulfilled, (state, action) => {
            state.loading = false;
            state.authority = action.payload;
        });
        builder.addCase(viewAuthority.rejected, (state, action) => {
            state.loading = false;
            state.message = action.payload as string;
        });
        builder.addCase(editAuthority.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(editAuthority.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.success;
            state.message = action.payload.message;
        });
        builder.addCase(editAuthority.rejected, (state, action) => {
            state.loading = false;
            state.error = true;
            state.message = action.payload as string;
        });
    }
});

export const { resetError, reset } = authoritySlice.actions;
export default authoritySlice.reducer;