import { createSlice } from "@reduxjs/toolkit";
import { allBookcase, Bookcase, createBookcase, deleteBookcase, editBookcase, viewBookcase } from "../actions/bookcase.action"


interface BookcaseState {
    success: boolean,
    message: string | null,
    loading: boolean,
    loadingLibrary: boolean,
    error: boolean,
    bookcase: Bookcase | null,
    bookcases: Array<Bookcase>,
    pagination: {
        total: number,
        page: number,
        limit: number,
        totalPages: number,
    }
}
const initialState: BookcaseState = {
    success: false as boolean,
    message: null,
    loading: false as boolean,
    loadingLibrary: false as boolean,
    bookcase: null,
    bookcases: [],
    error: false as boolean,
    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    }
};

const bookcaseSlice = createSlice({
    name: "bookcase",
    initialState,
    reducers: {
        resetError: (state) => {
            state.error = false;
            state.message = null;
        },
        reset: (state) => {
            state.message = null;
            state.success = false;
            state.bookcase = null;
            state.bookcases = [];
            state.pagination = {
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 0,
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(allBookcase.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(allBookcase.fulfilled, (state, action) => {
            state.loading = false;
            state.bookcases = action.payload.bookcases;
            state.pagination = action.payload.pagination;
        });
        builder.addCase(allBookcase.rejected, (state, action) => {
            state.loading = false;
            state.message = action.payload as string;
        });
        builder.addCase(createBookcase.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createBookcase.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
            state.success = action.payload.success;
        });
        builder.addCase(createBookcase.rejected, (state, action) => {
            state.loading = false;
            state.message = action.payload as string;
            state.error = true;
        });
        builder.addCase(deleteBookcase.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteBookcase.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
            state.success = action.payload.success;
        });
        builder.addCase(deleteBookcase.rejected, (state, action) => {
            state.loading = false;
            state.message = action.payload as string;
            state.error = true;
        });
        builder.addCase(viewBookcase.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(viewBookcase.fulfilled, (state, action) => {
            state.loading = false;
            state.bookcase = action.payload.bookcase;
        });
        builder.addCase(viewBookcase.rejected, (state, action) => {
            state.loading = false;
            state.message = action.payload as string;
        });
        builder.addCase(editBookcase.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(editBookcase.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
            state.success = action.payload.success;
        });
        builder.addCase(editBookcase.rejected, (state, action) => {
            state.loading = false;
            state.message = action.payload as string;
            state.error = true;
        });
    }
});

export const { resetError, reset } = bookcaseSlice.actions;
export default bookcaseSlice.reducer;