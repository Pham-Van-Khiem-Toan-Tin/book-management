import { createSlice } from "@reduxjs/toolkit";
import { allCategory, Category } from "../../actions/category.action";


interface CategoryState {
    success: boolean,
    message: string | null,
    loading: boolean,
    categories: Array<Category>
}
const initialState: CategoryState = {
    success: false as boolean,
    message: null,
    loading: false as boolean,
    categories: []
};

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        resetError: (state) => {
            state.message = null;
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
        })
    }
});

export const {resetError} = categorySlice.actions;
export default categorySlice.reducer;