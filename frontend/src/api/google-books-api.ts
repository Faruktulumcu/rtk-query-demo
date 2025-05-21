import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Book } from '@/common/types.ts';

interface GoogleBooksSearchResponse {
  items: {
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      industryIdentifiers?: { type: string; identifier: string }[];
      imageLinks?: {
        thumbnail?: string;
      };
    };
  }[];
}

export const googleBooksApi = createApi({
  reducerPath: 'googleBooksApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://www.googleapis.com/books/v1/' }),
  endpoints: (builder) => ({
    searchGoogleBooks: builder.query<Book[], string>({
      query: (query) => `volumes?q=${encodeURIComponent(query)}`,
      transformResponse: (response: GoogleBooksSearchResponse): Book[] => {
        return (
          response.items?.map((item) => {
            const info = item.volumeInfo;
            const isbn =
              info.industryIdentifiers?.find((id) => id.type === 'ISBN_13')?.identifier ??
              info.industryIdentifiers?.[0]?.identifier ??
              'unknown';

            return {
              id: item.id,
              title: info.title,
              author: info.authors?.join(', ') ?? 'Unknown',
              isbn,
              thumbnailUrl: info.imageLinks?.thumbnail,
            };
          }) ?? []
        );
      },
      keepUnusedDataFor: 20, // Cache for 20 seconds
    }),
  }),
});

export const { useSearchGoogleBooksQuery, useLazySearchGoogleBooksQuery } = googleBooksApi;
