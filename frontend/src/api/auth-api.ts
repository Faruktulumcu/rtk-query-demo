import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Credentials {
  username: string;
  password: string;
}

interface AuthResponse {
  token: string;
  userId: string;
  username: string;
}

// tenuto separato da baseApi a scopo dimostrativo
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    // baseUrl: '/api'
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, Credentials>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
