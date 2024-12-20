import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "./slices/auth/token.slice";
import authReducer from "./slices/auth/auth.slice";
import categoryReducer from "./slices/category/category.slice";
export const store = configureStore({
    reducer: {
        token: tokenReducer,
        auth: authReducer,
        category: categoryReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;