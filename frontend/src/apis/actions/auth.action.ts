import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { AUTH_ENDPOINT } from "../endpoints/auth.endpoint";

export const getToken = createAsyncThunk(
  "auth/token",
  async (_, { rejectWithValue }): Promise<unknown> => {
    try {
      const response = await axios.get(AUTH_ENDPOINT.TOKEN, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue("Error fetching user data");
    }
  }
);
