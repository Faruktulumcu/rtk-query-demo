import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

const PREFERENCE_KEY = 'user-preferences';

export const preferencesApi = createApi({
  reducerPath: 'preferencesApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['preferences'],
  endpoints: (builder) => ({
    getPreferences: builder.query({
      queryFn: () => {
        const raw = localStorage.getItem(PREFERENCE_KEY);
        const data = raw ? JSON.parse(raw) : { theme: 'light' };
        return { data };
      },
      providesTags: ['preferences']
    }),
    updatePreferences: builder.mutation({
      queryFn: (updates) => {
        const current = JSON.parse(localStorage.getItem(PREFERENCE_KEY) || '{}');
        const newPrefs = { ...current, ...updates };
        localStorage.setItem(PREFERENCE_KEY, JSON.stringify(newPrefs));
        return { data: newPrefs };
      },
      invalidatesTags: ['preferences'],
    }),
  }),
});

export const { useGetPreferencesQuery, useUpdatePreferencesMutation } = preferencesApi;
