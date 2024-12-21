import { createSlice } from "@reduxjs/toolkit";
import { allCategory, Category, createCategory } from "../../actions/category.action";


interface CategoryState {
    success: boolean,
    message: string | null,
    loading: boolean,
    error: boolean,
    categories: Array<Category>
}
const initialState: CategoryState = {
    success: false as boolean,
    message: null,
    loading: false as boolean,
    categories: [],
    error: false as boolean
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
        }
    },
    extraReducers: (builder) => {
        builder.addCase(allCategory.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(allCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.categories = action.payload.categories;
        });
        builder.addCase(allCategory.rejected, (state, action) => {
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
        
    }
});

export const {resetError, reset} = categorySlice.actions;
export default categorySlice.reducer;