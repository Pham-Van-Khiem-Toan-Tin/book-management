import { createSlice } from "@reduxjs/toolkit";
import { allBorrow, Borrow, createBorrowOffline } from "../actions/borrow.action";

interface BorrowState {
  success: boolean;
  message: string | null;
  loading: boolean;
  error: boolean;
  borrow: Borrow | null;
  borrows: Array<Borrow>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const initialState: BorrowState = {
  success: false as boolean,
  message: null,
  loading: false as boolean,
  error: false as boolean,
  borrow: null,
  borrows: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
};

const borrowSlice = createSlice({
  name: "borrow",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = false;
      state.message = null;
    },
    reset: (state) => {
      state.message = null;
      state.success = false;
      state.borrow = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(allBorrow.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(allBorrow.fulfilled, (state, action) => {
      state.loading = false;
      state.borrows = action.payload.borrows;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(allBorrow.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.message = action.payload as string;
    });
    builder.addCase(createBorrowOffline.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createBorrowOffline.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
      state.message = action.payload.message;
    });
    builder.addCase(createBorrowOffline.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.message = action.payload as string;
    });
  },
});

export const { resetError, reset } = borrowSlice.actions;
export default borrowSlice.reducer;
