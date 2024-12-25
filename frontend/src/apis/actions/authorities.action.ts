import { AxiosError } from "axios";
import useAuthAxios from "../../hooks/useAuthApi";
import { AUTHORITY_ENDPOINT } from "../endpoints/authority.endpoint";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface AuthorityCommon {
  _id: string;
  name: string;
}

interface AuthorityCommonResponse {
  authorities: Array<AuthorityCommon>;
}

export const authorityCommon = createAsyncThunk<AuthorityCommonResponse, void>(
  "authorities/common",
  async (_, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      const response = await authApi.get(`${AUTHORITY_ENDPOINT.COMMON}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching authorities");
    }
  }
);
