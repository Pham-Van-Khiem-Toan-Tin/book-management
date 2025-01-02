import { createAsyncThunk } from "@reduxjs/toolkit";
import useAuthAxios from "../../hooks/useAuthApi";
import { AxiosError } from "axios";
import { PROFILE_ENDPOINT } from "../endpoints/profile.endpoint";

export interface Profile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: {
    _id: string;
    name: string;
  };
  library: {
    _id: string;
    name: string;
  };
  avatar: {
    url: string;
    public_id: string | null;
  };
  createdAt: Date;
}

export const viewProfile = createAsyncThunk<{ user: Profile }, void>(
  "profile/view",
  async (_, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      const response = await authApi.get(PROFILE_ENDPOINT.VIEW);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching profile data");
    }
  }
);
interface ProfileResponse {
  success: boolean;
  message: string;
}
export const editProfile = createAsyncThunk<ProfileResponse, FormData>(
  "profile/edit",
  async (data, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      const response = await authApi.put(PROFILE_ENDPOINT.EDIT, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error editing profile data");
    }
  }
);
