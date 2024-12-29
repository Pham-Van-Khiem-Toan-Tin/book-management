import { createAsyncThunk } from "@reduxjs/toolkit";
import useAuthAxios from "../../hooks/useAuthApi";
import { AxiosError } from "axios";
import { CATEGORY_ENDPOINT } from "../endpoints/category.endpoint";

export interface Category {
  _id: string;
  name: string;
  parent_id: null | {
    _id: string;
    name: string;
  };
  description: string;
  createdAt: string;
}
type AllCategory = {
  categories: Array<Category>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
interface CategoryDetailRes {
  category: Category;
}
interface CategorySearch {
  keyword: string | null | undefined;
  page: number | null;
  view: number | null;
}
interface CategoryResponse {
  success: boolean;
  message: string;
}
export const allCategory = createAsyncThunk<AllCategory, CategorySearch>(
  "category/all",
  async ({ keyword, view, page }, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      let query = "";
      if (keyword) query += `?keyword=${encodeURIComponent(keyword)}`;
      if (page) query += `${query ? "&" : "?"}page=${page}`;
      if (view) query += `${query ? "&" : "?"}limit=${view}`;
      const response = await authApi.get(CATEGORY_ENDPOINT.ALL + query);
      return response.data;
    } catch (error) {
      console.log(error);

      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching user data");
    }
  }
);
export interface CategoryCommon {
  _id: string;
  name: string;
}
interface AllCategoryCommon {
  categories: Array<CategoryCommon>;
}
export const commonCategory = createAsyncThunk<AllCategoryCommon, void>(
  "category/common",
  async (_, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();

      const response = await authApi.get(CATEGORY_ENDPOINT.COMMON);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching user data");
    }
  }
);

export const subCategory = createAsyncThunk<AllCategoryCommon, void>(
  "category/sub",
  async (_, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      const response = await authApi.get(CATEGORY_ENDPOINT.SUBCATEGORY);
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
  name: string;
  parentId: string | null;
  description: string;
}
export const createCategory = createAsyncThunk<CategoryResponse, CategoryForm>(
  "category/create",
  async (form, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      const response = await authApi.post(CATEGORY_ENDPOINT.CREATE, form);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching user data");
    }
  }
);

export const categoryDetail = createAsyncThunk<CategoryDetailRes, string>(
  "category/detail",
  async (categoryId, { rejectWithValue }) => {
    try {
      const authApi = useAuthAxios();
      const response = await authApi.get(
        `${CATEGORY_ENDPOINT.VIEW}/${categoryId}`
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching user data");
    }
  }
);
interface CategoryEditForm {
  _id: string;
  name: string;
  parentId: string | null;
  description: string;
}
export const editCategory = createAsyncThunk<
  CategoryResponse,
  CategoryEditForm
>("categories/edit", async (form, { rejectWithValue }) => {
  const authApi = useAuthAxios();
  try {
    const response = await authApi.put(
      `${CATEGORY_ENDPOINT.EDIT}/${form._id}`,
      form
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue("Error fetching user data");
  }
});

export const deleteCategory = createAsyncThunk<CategoryResponse, string>(
  "categories/delete",
  async (id, { rejectWithValue }) => {
    const authApi = useAuthAxios();
    try {
      const response = await authApi.delete(
        `${CATEGORY_ENDPOINT.DELETE}/${id}`
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error fetching user data");
    }
  }
);
