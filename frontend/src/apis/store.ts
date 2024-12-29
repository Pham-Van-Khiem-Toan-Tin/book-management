import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "./slices/auth/token.slice";
import authReducer from "./slices/auth/auth.slice";
import categoryReducer from "./slices/category/category.slice";
import libraryReducer from "./slices/library/library.slice";
import bookcaseReducer from "./slices/bookcase/bookcase.slice";
import bookshelfReducer from "./slices/bookshelf/bookshelf.slice";
import userReducer from "./slices/user/user.slice";
import authorityReducer from "./slices/authority/authority.slice";
import functionReducer from "./slices/function.slice";
import subFunctionReducer from "./slices/subfunction.slice";
import bookReducer from "./slices/book.slice";

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
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;