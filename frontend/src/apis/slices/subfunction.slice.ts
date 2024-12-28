import { createSlice } from "@reduxjs/toolkit";
import { allSubFunctions, createSubFunction, SubFunction } from "../actions/subfunction.action";

interface SubFunctionState {
    success: boolean,
    message: string | null,
    loading: boolean,
    error: boolean,
    subfunctions: Array<SubFunction>,
    pagination: {
        total: number,
        page: number,
        limit: number,
        totalPages: number,
    }
};

const initialState: SubFunctionState = {
    success: false as boolean,
    message: null,
    loading: false as boolean,
    error: false as boolean,
    subfunctions: [],
    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    }
};

const subfunctionSlice = createSlice({
    name: "subfunction",
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
        builder.addCase(allSubFunctions.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(allSubFunctions.fulfilled, (state, action) => {
            state.loading = false;
            state.subfunctions = action.payload.subfunctions;
            state.pagination = action.payload.pagination;
        });
        builder.addCase(allSubFunctions.rejected, (state, action) => {
            state.loading = false;
            state.message = action.payload as string;
        });
        builder.addCase(createSubFunction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createSubFunction.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.success;
            state.message = action.payload.message;
        });
        builder.addCase(createSubFunction.rejected, (state, action) => {
            state.loading = false;
            state.message = action.payload as string;
        });
    }
});

export const { resetError, reset } = subfunctionSlice.actions;
export default subfunctionSlice.reducer;