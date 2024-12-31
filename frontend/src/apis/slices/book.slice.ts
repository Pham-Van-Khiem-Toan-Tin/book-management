import { createSlice } from "@reduxjs/toolkit";
import { allBook, allBookOfLibrary, Book, BookOfLibrary, BookSelect, createBook, editBook, selectBook, viewBook } from "../actions/book.action";
import { CategoryCommon, subCategory } from "../actions/category.action";

interface BookState {
  success: boolean;
  message: string | null;
  loading: boolean;
  loadingCategory: boolean;
  error: boolean;
  book: Book | null;
  bookOfLibrary: Array<BookOfLibrary>;
  books: Array<Book>;
  bookSelects: Array<BookSelect>;
  categories: Array<CategoryCommon>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
const initialState: BookState = {
  success: false as boolean,
  message: null,
  loading: false as boolean,
  loadingCategory: false as boolean,
  book: null,
  bookOfLibrary: [],
  books: [],
  bookSelects: [],
  categories: [],
  error: false as boolean,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
};

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = false;
      state.message = null;
    },
    reset: (state) => {
      state.message = null;
      state.success = false;
      state.book = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(allBook.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(allBook.fulfilled, (state, action) => {
      state.loading = false;
      state.books = action.payload.books;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(allBook.rejected, (state, action) => {
      state.loading = false;
      state.message = action.payload as string;
    });
    builder.addCase(allBookOfLibrary.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(allBookOfLibrary.fulfilled, (state, action) => {
      state.loading = false;
      state.bookOfLibrary = action.payload.books;
    });
    builder.addCase(allBookOfLibrary.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
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
    builder.addCase(createBook.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createBook.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = action.payload.message;
    });
    builder.addCase(createBook.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.message = action.payload as string;
    });
    builder.addCase(viewBook.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(viewBook.fulfilled, (state, action) => {
      state.loading = false;
      state.book = action.payload.book;
    });
    builder.addCase(viewBook.rejected, (state, action) => {
      state.loading = false;
      state.message = action.payload as string;
    });
    builder.addCase(editBook.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(editBook.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = action.payload.message;
    });
    builder.addCase(editBook.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.message = action.payload as string;
    });
    builder.addCase(selectBook.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(selectBook.fulfilled, (state, action) => {
      state.loading = false;
      state.bookSelects = action.payload.books;
    });
    builder.addCase(selectBook.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.message = action.payload as string;
    });
    // builder.addCase(deleteBook.pending, (state) => {
    // state.loading = true;
    // });
    // builder.addCase(deleteBook.fulfilled, (state, action) => {
    // state.loading = false;
    // state.success = true;
    // state.message = action.payload as string;
    // });
    // builder.addCase(deleteBook.rejected, (state, action) => {
    // state.loading = false;
    // state.error = true;
    // state.message = action.payload as string;
    // }
  },
});

export const { resetError, reset } = bookSlice.actions;
export default bookSlice.reducer;
