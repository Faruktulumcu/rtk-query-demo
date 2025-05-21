import { baseApi } from './base-api';
import type { Review } from '@/common/types.ts';

type UpsertReviewRequest = { bookId: string; review: Pick<Review, 'content' | 'public'> };

type UpdateReviewRequest = { bookId: string; review: Pick<Review, 'id' | 'content' | 'public'> };

export const reviewsApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ['Reviews'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getReviews: build.query<Review[], string>({
        query: (bookId) => `/books/${bookId}/reviews`,
        providesTags: (_result, _error, bookId) => [{ type: 'Reviews', id: bookId }],
      }),

      getPublicReviews: build.query<Review[], string>({
        query: (isbn) => `/books/${isbn}/public-reviews`,
        providesTags: (_result, _error, isbn) => [{ type: 'Reviews', id: `public-${isbn}` }],
      }),

      addReview: build.mutation<Review, UpsertReviewRequest>({
        query: ({ bookId, review }) => ({
          url: `/books/${bookId}/reviews`,
          method: 'POST',
          body: review,
        }),
        invalidatesTags: (_result, _error, { bookId }) => [{ type: 'Reviews', id: bookId }],
      }),

      updateReview: build.mutation<Review, UpdateReviewRequest>({
        query: ({ bookId, review }) => ({
          url: `/books/${bookId}/reviews/${review.id}`,
          method: 'PUT',
          body: review,
        }),
        invalidatesTags: ['Reviews'],
      }),

      deleteReview: build.mutation<void, { bookId: string; id: string }>({
        query: ({ bookId, id }) => ({
          url: `/books/${bookId}/reviews/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Reviews'],
      }),
    }),
    overrideExisting: false,
  });

export const {
  useGetReviewsQuery,
  useGetPublicReviewsQuery,
  useAddReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewsApi;
