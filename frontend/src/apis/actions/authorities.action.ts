import { AxiosError } from "axios";
import useAuthAxios from "../../hooks/useAuthApi";
import { AUTHORITY_ENDPOINT } from "../endpoints/authority.endpoint";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface AuthorityCommon {
  _id: string;
  name: string;
}
export interface Authority {
  _id: string;
  name: string;
  description: string;
  order: number;
  createdAt: string;
}
interface AllAuthority {
  authorities: Array<Authority>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
interface AuthoritySearch {
  keyword: string | null | undefined;
  page: number | null;
  view: number | null;
}
interface AuthorityCommonResponse {
  authorities: Array<AuthorityCommon>;
}

export const allAuthorities = createAsyncThunk<AllAuthority, AuthoritySearch>(
  "authorities/all",
  async ({keyword, view, page}, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      let query = "";
      if (keyword) query += `?keyword=${encodeURIComponent(keyword)}`;
      if (page) query += `${query ? "&" : "?"}page=${page}`;
      if (view) query += `${query ? "&" : "?"}limit=${view}`;
      const response = await authApi.get(AUTHORITY_ENDPOINT.ALL + query);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching authorities");
    }
  }
);

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

interface SubFunctionDetail {
  _id: string;
  name: string;
  active: boolean;
}
interface FunctionDetail {
  _id: string;
  name: string;
  subFunctions: Array<SubFunctionDetail>;
}
export interface AuthorityDetail {
  _id: string;
  role: Array<FunctionDetail>;
}
export const viewAuthority = createAsyncThunk<AuthorityDetail, string>(
  "authorities/detail",
  async (id, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      const response = await authApi.get(`${AUTHORITY_ENDPOINT.VIEW}/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching authority");
    }
  }
);

interface AuthorityResponse {
  success: boolean;
  message: string;
}
export const editAuthority = createAsyncThunk<AuthorityResponse, AuthorityDetail>(
  "authorities/edit",
  async (authority, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      const response = await authApi.put(`${AUTHORITY_ENDPOINT.EDIT}/${authority._id}`, authority);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error editing authority");
    }
  }
);
