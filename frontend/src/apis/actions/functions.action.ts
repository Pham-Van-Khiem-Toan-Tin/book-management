import { AxiosError } from "axios";
import useAuthAxios from "../../hooks/useAuthApi";
import { FUNCTION_ENDPOINT } from "../endpoints/function.endpoint";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface FunctionCommon {
  _id: string;
  name: string;
}
export interface FunctionEntity {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface AllFunction {
  functions: Array<FunctionEntity>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
interface FunctionSearch {
  keyword: string | null | undefined;
  page: number | null;
  view: number | null;
}

interface FunctionCommonResponse {
  functions: Array<FunctionCommon>;
}

export const allFunctions = createAsyncThunk<AllFunction, FunctionSearch>(
  "functions/all",
  async ({ keyword, view, page }, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      let query = "";
      if (keyword) query += `?keyword=${encodeURIComponent(keyword)}`;
      if (page) query += `${query ? "&" : "?"}page=${page}`;
      if (view) query += `${query ? "&" : "?"}limit=${view}`;
      const response = await authApi.get(FUNCTION_ENDPOINT.ALL + query);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching functions");
    }
  }
);

export const functionCommon = createAsyncThunk<FunctionCommonResponse, void>(
  "functions/common",
  async (_, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      const response = await authApi.get(`${FUNCTION_ENDPOINT.COMMON}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching functions");
    }
  }
);

export const viewFunction = createAsyncThunk<FunctionEntity, string>(
  "functions/view",
  async (id, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      const response = await authApi.get(`${FUNCTION_ENDPOINT.VIEW}/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching function");
    }
  }
);
