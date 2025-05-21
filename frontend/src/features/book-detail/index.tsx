import { useParams } from 'react-router';
import { useState } from 'react';
import { useGetBookDetailQuery } from '@/api/books-api';
import {
  useAddReviewMutation,
  useDeleteReviewMutation,
  useGetPublicReviewsQuery,
  useGetReviewsQuery,
  useUpdateReviewMutation,
} from '@/api/reviews-api';
import type { Review } from '@/common/types';
import { ReviewForm } from './components/review-form';
import { UserReviews } from './components/user-reviews';
import { PublicReviews } from './components/public-reviews';
import { BookCard } from '@/common/components';

export const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: book, isLoading, error } = useGetBookDetailQuery(id!);

  const { data: myReviews = [], refetch } = useGetReviewsQuery(id!, {
    skip: !id,
  });

  const { data: publicReviews = [] } = useGetPublicReviewsQuery(book?.isbn ?? '', {
    skip: !book?.isbn,
    pollingInterval: 5000,
  });

  const [addReview] = useAddReviewMutation();
  const [updateReview] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const handleSubmitReview = async (content: string, isPublic: boolean) => {
    if (!id || !content.trim()) return;
    const payload = {
      bookId: id,
      review: {
        content,
        public: isPublic,
      },
    };

    if (editingReview) {
      await updateReview({ ...payload, review: { ...payload.review, id: editingReview.id } });
    } else {
      await addReview(payload);
    }

    setEditingReview(null);
    refetch();
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  const handleDelete = async (reviewId: string) => {
    if (!id) return;
    await deleteReview({ bookId: id, id: reviewId });
    refetch();
  };

  if (isLoading) return <div className="flex justify-center p-12">Loading book...</div>;
  if (error || !book) return <div className="flex justify-center p-12">Book not found.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Book Details</h1>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <BookCard book={book} />
        </div>
      </div>
      <ReviewForm onSubmit={handleSubmitReview} editingReview={editingReview} onCancel={handleCancelEdit} />
      <UserReviews reviews={myReviews} onEdit={handleEdit} onDelete={handleDelete} />
      <PublicReviews reviews={publicReviews} />
    </div>
  );
};
