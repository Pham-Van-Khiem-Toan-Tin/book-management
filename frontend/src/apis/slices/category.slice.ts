import { createSlice } from "@reduxjs/toolkit";
import {
  allCategory,
  Category,
  CategoryCommon,
  categoryDetail,
  commonCategory,
  createCategory,
  deleteCategory,
  editCategory,
} from "../actions/category.action";

interface CategoryState {
  success: boolean;
  message: string | null;
  loading: boolean;
  error: boolean;
  category: Category | null;
  categoryCommon: Array<CategoryCommon>;
  categories: Array<Category>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
const initialState: CategoryState = {
  success: false as boolean,
  message: null,
  loading: false as boolean,
  category: null,
  categoryCommon: [],
  categories: [],
  error: false as boolean,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = false;
      state.message = null;
    },
    reset: (state) => {
      state.message = null;
      state.success = false;
      state.category = null;
      state.categories = [];
      state.pagination = {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(allCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(allCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = action.payload.categories;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(allCategory.rejected, (state, action) => {
      state.loading = false;
      state.message = action.payload as string;
    });
    builder.addCase(commonCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(commonCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.categoryCommon = action.payload.categories;
    });
    builder.addCase(commonCategory.rejected, (state, action) => {
      state.error = true;
      state.loading = false;
      state.message = action.payload as string;
    });
    builder.addCase(createCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
      state.message = action.payload.message;
    });
    builder.addCase(createCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.message = action.payload as string;
    });
    builder.addCase(categoryDetail.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(categoryDetail.fulfilled, (state, action) => {
      state.loading = false;
      state.category = action.payload.category;
    });
    builder.addCase(categoryDetail.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.message = action.payload as string;
    });
    builder.addCase(editCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(editCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
      state.message = action.payload.message;
    });
    builder.addCase(editCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.message = action.payload as string;
    });
    builder.addCase(deleteCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
      state.message = action.payload.message;
    });
    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.message = action.payload as string;
    });
  },
});

export const { resetError, reset } = categorySlice.actions;
export default categorySlice.reducer;
