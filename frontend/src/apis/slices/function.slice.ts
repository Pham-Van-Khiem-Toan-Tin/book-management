import { createSlice } from "@reduxjs/toolkit";
import { allFunctions, FunctionEntity, viewFunction } from "../actions/functions.action";

interface FunctionState {
    success: boolean,
    message: string | null,
    loading: boolean,
    error: boolean,
    functionDetail: FunctionEntity | null,
    functions: Array<FunctionEntity>,
    pagination: {
        total: number,
        page: number,
        limit: number,
        totalPages: number,
    }
};

const initialState: FunctionState = {
    success: false as boolean,
    message: null,
    loading: false as boolean,
    error: false as boolean,
    functionDetail: null,
    functions: [],
    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    }
};

const functionSlice = createSlice({
    name: "function",
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
        builder.addCase(allFunctions.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(allFunctions.fulfilled, (state, action) => {
            state.loading = false;
            state.functions = action.payload.functions;
            state.pagination = action.payload.pagination;
        });
        builder.addCase(allFunctions.rejected, (state, action) => {
            state.loading = false;
            state.message = action.payload as string;
        });
        builder.addCase(viewFunction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(viewFunction.fulfilled, (state, action) => {
            state.loading = false;
            state.functionDetail = action.payload;
        });
        builder.addCase(viewFunction.rejected, (state, action) => {
            state.loading = false;
            state.message = action.payload as string;
        });
    }
});

export const { resetError, reset } = functionSlice.actions;
export default functionSlice.reducer;
