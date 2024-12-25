import { createSlice } from "@reduxjs/toolkit";
import { loginSuccess } from "../../actions/auth.action";

interface TokenState {
  success: boolean;
  message: string | null;
  loading: boolean;
}

const initialState: TokenState = {
  success: false as boolean,
  message: null,
  loading: false as boolean,
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    resetError: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginSuccess.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginSuccess.fulfilled, (state, action) => {
      state.loading = false;
      localStorage.setItem("act", action.payload.accessToken);
      localStorage.setItem("sb", action.payload.sub);
    });
    builder.addCase(loginSuccess.rejected, (state) => {
      state.loading = false;
      state.message = "Unable to log in. Please try again later.";
    });
  },
});

export const { resetError } = tokenSlice.actions;
export default tokenSlice.reducer;
