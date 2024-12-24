import { createSlice } from "@reduxjs/toolkit";
import { allLibrary, createLibrary, deleteLibrary, editLibrary, Library, viewLibrary } from "../../actions/library.action";


interface LibraryState {
    success: boolean,
    message: string | null,
    loading: boolean,
    error: boolean,
    library: Library | null,
    libraries: Array<Library>
    pagination: {
        total: number,
        page: number,
        limit: number,
        totalPages: number,
    }
};
const initialState: LibraryState = {
    success: false as boolean,
    message: null,
    loading: false as boolean,
    library: null,
    libraries: [],
    error: false as boolean,
    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    }
};

const librarySlice = createSlice({
    name: "library",
    initialState,
    reducers: {
        resetError: (state) => {
            state.error = false;
            state.message = null;
        },
        reset: (state) => {
            state.message = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(allLibrary.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(allLibrary.fulfilled, (state, action) => {
            state.loading = false;
            state.libraries = action.payload.libraries;
            state.pagination = action.payload.pagination;
        });
        builder.addCase(allLibrary.rejected, (state, action) => {
            state.loading = false;
            state.message = action.payload as string;
        });
        builder.addCase(createLibrary.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createLibrary.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.success;
            state.message = action.payload.message;
        });
        builder.addCase(createLibrary.rejected, (state, action) => {
            state.loading = false;
            state.error = true;
            state.message = action.payload as string;
        });
        builder.addCase(viewLibrary.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(viewLibrary.fulfilled, (state, action) => {
            state.loading = false;
            state.library = action.payload.library;
        });
        builder.addCase(viewLibrary.rejected, (state, action) => {
            state.loading = false;
            state.message = action.payload as string;
        });
        builder.addCase(editLibrary.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(editLibrary.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.success;
            state.message = action.payload.message;
        });
        builder.addCase(editLibrary.rejected, (state, action) => {
            state.loading = false;
            state.error = true;
            state.message = action.payload as string;
        });
        builder.addCase(deleteLibrary.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteLibrary.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.success;
            state.message = action.payload.message;
        });
        builder.addCase(deleteLibrary.rejected, (state, action) => {
            state.loading = false;
            state.error = true;
            state.message = action.payload as string;
        });
    }
});

export const { resetError, reset } = librarySlice.actions;
export default librarySlice.reducer;
