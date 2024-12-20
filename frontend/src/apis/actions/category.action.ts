import { createAsyncThunk } from "@reduxjs/toolkit";
import useAuthAxios from "../../hooks/useAuthApi";
import { AxiosError } from "axios";
import { CATEGORY_ENDPOINT } from "../endpoints/category.endpoint";

export interface Category {
    _id: string,
    name: string,
    parent: null | {
        name: string
    },
    created_at: Date
}
type AllCategory = {
    categories: Array<Category>
}
export const allCategory = createAsyncThunk<AllCategory, void>(
  "category/all",
  async (_, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      const response = await authApi.get(CATEGORY_ENDPOINT.ALL);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching user data");
    }
  }
);
