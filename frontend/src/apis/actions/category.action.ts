import { createAsyncThunk } from "@reduxjs/toolkit";
import useAuthAxios from "../../hooks/useAuthApi";
import { AxiosError } from "axios";
import { CATEGORY_ENDPOINT } from "../endpoints/category.endpoint";

export interface Category {
    _id: string,
    name: string,
    parent_id: null | {
        name: string
    },
    createdAt: string
}
type AllCategory = {
    categories: Array<Category>
}
interface CategoryResponse {
  success: boolean,
  message: string
}
export const allCategory = createAsyncThunk<AllCategory, string | null>(
  "category/all",
  async (keyword, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      const response = await authApi.get(`${CATEGORY_ENDPOINT.ALL}${keyword ? "?keyword=" + keyword : ""}`);      
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching user data");
    }
  }
);
interface CategoryForm {
  name: string,
  parentId: string | null,
  description: string
}
export const createCategory = createAsyncThunk<CategoryResponse, CategoryForm>(
  "category/create",
  async (form, {rejectWithValue}) => {
    try {
      const authApi = useAuthAxios();
      const response = await authApi.post(CATEGORY_ENDPOINT.CREATE, form);
      return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching user data");
    }
  }
)
