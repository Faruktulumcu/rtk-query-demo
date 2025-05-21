import { baseApi } from './base-api';
import type { Book } from '@/common/types.ts';

export const booksApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['Books'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getBooks: build.query<Book[], void>({
        query: () => '/books',
        providesTags: ['Books'],
      }),
      getBookDetail: build.query<Book, string>({
        query: (id) => `/books/${id}`,
        providesTags: (_result, _error, id) => [{ type: 'Books', id }],
      }),
      addBook: build.mutation<Book, Omit<Book, 'id'>>({
        query: (book) => ({
          url: '/books',
          method: 'POST',
          body: book,
        }),
        invalidatesTags: ['Books'],
      }),
    }),
    overrideExisting: false,
  });

export const { useGetBooksQuery, useGetBookDetailQuery, useAddBookMutation } = booksApi;
