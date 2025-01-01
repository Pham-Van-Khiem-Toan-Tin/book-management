import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { AUTH_ENDPOINT } from "../endpoints/auth.endpoint";
import useAuthAxios from "../../hooks/useAuthApi";

interface TokenResponse {
  accessToken: string,
  functions: Array<string>,
}
export const loginSuccess = createAsyncThunk<TokenResponse, void>(
  "auth/token",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(AUTH_ENDPOINT.LOGIN_SUCCESS, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching user data");
    }
  }
);
interface BaseProfileResponse {
  sub: string;
  library: string | null;
  name: string;
  roles: Array<string>,
  avatar: string,
  order: number,
}
export const baseProfile = createAsyncThunk<BaseProfileResponse, void>(
  "auth/base",
  async (_, {rejectWithValue}) => {
    try {
      const authApi = useAuthAxios();
      const response = await authApi.get(AUTH_ENDPOINT.PROFILE_BASE);
      
      return response.data as BaseProfileResponse;
    } catch (error) {      
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching user data");
    }
  }
)

