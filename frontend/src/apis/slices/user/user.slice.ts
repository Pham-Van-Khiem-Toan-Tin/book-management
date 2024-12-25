import { createSlice } from "@reduxjs/toolkit";
import { allUser, editUser, lockUser, User, viewUser } from "../../actions/user.action";
import { authorityCommon, AuthorityCommon } from "../../actions/authorities.action";


interface UserState {
    success: boolean,
    message: string | null,
    loading: boolean,
    loadingAuthorities: boolean,
    error: boolean,
    user: User | null,
    users: Array<User>,
    authorities: Array<AuthorityCommon>
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
    loadingAuthorities: false as boolean,
    user: null,
    users: [],
    authorities: [],
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
        builder.addCase(lockUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(lockUser.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.success;
            state.message = action.payload.message;
        });
        builder.addCase(lockUser.rejected, (state, action) => {
            state.loading = false;
            state.message = action.payload as string;
        });
        builder.addCase(viewUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(viewUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
        });
        builder.addCase(viewUser.rejected, (state, action) => {
            state.loading = false;
            state.error = true;
            state.message = action.payload as string;
        });
        builder.addCase(editUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(editUser.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.success;
            state.message = action.payload.message;
        });
        builder.addCase(editUser.rejected, (state, action) => {
            state.loading = false;
            state.error = true;
            state.message = action.payload as string;
        });
        builder.addCase(authorityCommon.pending, (state) => {
            state.loadingAuthorities = true;
        });
        builder.addCase(authorityCommon.fulfilled, (state, action) => {
            state.loadingAuthorities = false;
            state.authorities = action.payload.authorities;
        });
        builder.addCase(authorityCommon.rejected, (state, action) => {
            state.loadingAuthorities = false;
            state.error = true;
            state.message = action.payload as string;
        });
    }
});

export const { resetError, reset } = userSlice.actions;
export default userSlice.reducer;