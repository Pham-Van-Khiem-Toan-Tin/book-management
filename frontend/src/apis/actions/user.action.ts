import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { USER_ENDPOINT } from "../endpoints/user.endpoint";
import useAuthAxios from "../../hooks/useAuthApi";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: {
    _id: string;
    name: string;
  };
  lock: boolean;
  createdAt: string;
}
interface AllUsers {
  users: Array<User>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
interface UserDetailRes {
    user: User;
}
interface UserSearch {
  keyword: string | null | undefined;
  page: number | null;
  view: number | null;
}
interface UserResponse {
  success: boolean;
  message: string;
}
export const allUser = createAsyncThunk<AllUsers, UserSearch>(
  "users/all",
  async ({ keyword, view, page }, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      let query = "";
      if (keyword) query += `?keyword=${encodeURIComponent(keyword)}`;
      if (page) query += `${query ? "&" : "?"}page=${page}`;
      if (view) query += `${query ? "&" : "?"}limit=${view}`;
      const response = await authApi.get(USER_ENDPOINT.ALL + query);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching user data");
    }
  }
);
interface UserEditForm {
  _id: string;
  name: string;
  email: string;
  roleId: string;
}
export const editUser = createAsyncThunk<UserResponse, UserEditForm>(
  "users/edit",
  async (data, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      const response = await authApi.put(`${USER_ENDPOINT.EDIT}/${data._id}`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error editing user");
    }
  }
);

export const lockUser = createAsyncThunk<
  UserResponse,
  { id: string; status: boolean }
>("users/lock", async ({ id, status }, { rejectWithValue }) => {
  try {
    const authApi = useAuthAxios();
    const response = await authApi.put(`${USER_ENDPOINT.LOCK}/${id}`, {
      status,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue("Error locking user");
  }
});

export const viewUser = createAsyncThunk<UserDetailRes, string>(
  "users/view",
  async (id, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      const response = await authApi.get(`${USER_ENDPOINT.VIEW}/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching user data");
    }
  }
);
