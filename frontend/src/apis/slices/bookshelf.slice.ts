import { createSlice } from "@reduxjs/toolkit";
import { addBookToBookshelf, allBookshelf, Bookshelf, createBookshelf, deleteBookshelf, editBookshelf, viewBookshelf } from "../actions/bookshelf.action";
import { allCommonBookcase, CommonBookcase } from "../actions/bookcase.action";
import { CategoryCommon, subCategory } from "../actions/category.action";

interface BookshelfState {
    success: boolean,
    message: string | null,
    loading: boolean,
    loadingBookcase: boolean,
    loadingCategory: boolean,
    error: boolean,
    bookshelf: Bookshelf | null,
    bookshelves: Array<Bookshelf>,
    bookcases: Array<CommonBookcase>,
    categories: Array<CategoryCommon>,
    pagination: {
        total: number,
        page: number,
        limit: number,
        totalPages: number,
    }
}
const initialState: BookshelfState = {
    success: false as boolean,
    message: null,
    loading: false as boolean,
    loadingBookcase: false as boolean,
    loadingCategory: false as boolean,
    bookshelf: null,
    bookshelves: [],
    bookcases: [],
    categories: [],
    error: false as boolean,
    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    }
};
const bookshelfSlice = createSlice({
    name: "bookshelf",
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
        builder.addCase(allBookshelf.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(allBookshelf.fulfilled, (state, action) => {
            state.loading = false;
            state.bookshelves = action.payload.bookshelves;
            state.pagination = action.payload.pagination;
        });
        builder.addCase(allBookshelf.rejected, (state, action) => {
            state.loading = false;
            state.message = action.payload as string;
        });
        builder.addCase(allCommonBookcase.pending, (state) => {
            state.loadingBookcase = true;
        });
        builder.addCase(allCommonBookcase.fulfilled, (state, action) => {
            state.loadingBookcase = false;
            state.bookcases = action.payload.bookcases;
        });
        builder.addCase(allCommonBookcase.rejected, (state, action) => {
            state.loadingBookcase = false;
            state.message = action.payload as string;
        });
        builder.addCase(subCategory.pending, (state) => {
            state.loadingCategory = true;
        });
        builder.addCase(subCategory.fulfilled, (state, action) => {
            state.loadingCategory = false;
            state.categories = action.payload.categories;
        });
        builder.addCase(subCategory.rejected, (state, action) => {
            state.loadingCategory = false;
            state.error = true;
            state.message = action.payload as string;
        });
        builder.addCase(createBookshelf.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createBookshelf.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
            state.success = action.payload.success;
        });
        builder.addCase(createBookshelf.rejected, (state, action) => {
            state.loading = false;
            state.message = action.payload as string;
            state.error = true;
        });
        builder.addCase(deleteBookshelf.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteBookshelf.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
            state.success = action.payload.success;
        });
        builder.addCase(deleteBookshelf.rejected, (state, action) => {
            state.loading = false;
            state.message = action.payload as string;
            state.error = true;
        });
        builder.addCase(viewBookshelf.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(viewBookshelf.fulfilled, (state, action) => {
            state.loading = false;
            state.bookshelf = action.payload.bookshelf;
        });
        builder.addCase(viewBookshelf.rejected, (state, action) => {
            state.loading = false;
            state.error = true;
            state.message = action.payload as string;
        });
        builder.addCase(editBookshelf.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(editBookshelf.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.success;
            state.message = action.payload.message;
        });
        builder.addCase(editBookshelf.rejected, (state, action) => {
            state.loading = false;
            state.error = true;
            state.message = action.payload as string;
        });
        builder.addCase(addBookToBookshelf.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(addBookToBookshelf.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.success;
            state.message = action.payload.message;
        });
        builder.addCase(addBookToBookshelf.rejected, (state, action) => {
            state.loading = false;
            state.error = true;
            state.message = action.payload as string;
        });
    }
});

export const { resetError, reset } = bookshelfSlice.actions;
export default bookshelfSlice.reducer;