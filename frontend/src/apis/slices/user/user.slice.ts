import { createSlice } from "@reduxjs/toolkit";
import { allUser, User } from "../../actions/user.action";

interface UserState {
    success: boolean,
    message: string | null,
    loading: boolean,
    error: boolean,
    user: User | null,
    users: Array<User>,
    pagination: {
        total: number,
        page: number,
        limit: number,
        totalPages: number,
    }
};

const initialState: UserState = {
    success: false as boolean,
    message: null,
    loading: false as boolean,
    user: null,
    users: [],
    error: false as boolean,
    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    }
};

const userSlice = createSlice({
    name: "user",
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
        builder.addCase(allUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(allUser.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload.users;
            state.pagination = action.payload.pagination;
        });
        builder.addCase(allUser.rejected, (state, action) => {
            state.loading = false;
            state.error = true;
            state.message = action.payload as string;
        });
        // builder.addCase(lockUser.pending, (state) => {
        //     state.loading = true;
        // });
        // builder.addCase(lockUser.fulfilled, (state, action) => {
        //     state.loading = false;
        //     state.success = action.payload.success;
        //     state.message = action.payload.message;
        // });
        // builder.addCase(lockUser.rejected, (state, action) => {
        //     state.loading = false;
        //     state.message = action.payload as string;
        // });
    }
});

export const { resetError, reset } = userSlice.actions;
export default userSlice.reducer;