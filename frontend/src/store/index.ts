import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '@/api/auth-api';
import authReducer from './auth-slice';
import { baseApi } from '@/api/base-api.ts';
import { googleBooksApi } from '@/api/google-books-api.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [googleBooksApi.reducerPath]: googleBooksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, authApi.middleware, googleBooksApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
