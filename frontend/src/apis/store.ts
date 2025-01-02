import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "./slices/token.slice";
import authReducer from "./slices/auth.slice";
import categoryReducer from "./slices/category.slice";
import libraryReducer from "./slices/library.slice";
import bookcaseReducer from "./slices/bookcase.slice";
import bookshelfReducer from "./slices/bookshelf.slice";
import userReducer from "./slices/user.slice";
import authorityReducer from "./slices/authority.slice";
import functionReducer from "./slices/function.slice";
import subFunctionReducer from "./slices/subfunction.slice";
import bookReducer from "./slices/book.slice";
import borrowReducer from "./slices/borrow.slice";
import profileReducer from "./slices/profile.slice";


export const store = configureStore({
    reducer: {
        token: tokenReducer,
        auth: authReducer,
        category: categoryReducer,
        library: libraryReducer,
        bookcase: bookcaseReducer,
        bookshelf: bookshelfReducer,
        user: userReducer,
        authority: authorityReducer,
        functions: functionReducer,
        subFunction: subFunctionReducer,
        book: bookReducer,
        borrow: borrowReducer,
        profile: profileReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;