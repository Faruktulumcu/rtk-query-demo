import type { Review } from '@/common/types';
import { Edit2, Trash2 } from 'lucide-react';
import { ReviewItem } from '@/common/components';

type UserReviewsProps = {
  reviews: Review[];
  onEdit: (review: Review) => void;
  onDelete: (id: string) => void;
};

export const UserReviews = ({ reviews, onEdit, onDelete }: UserReviewsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium mb-4 text-gray-800 flex items-center">
        Your Reviews
        {reviews.length > 0 && (
          <span className="ml-2 text-sm bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{reviews.length}</span>
        )}
      </h2>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="relative bg-gray-50 rounded-lg p-4 group">
              <ReviewItem review={review} isOwner />
              <div className="absolute bottom-1 right-3 flex gap-2">
                <button
                  className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                  onClick={() => onEdit(review)}
                  aria-label="Edit review">
                  <Edit2 size={20} />
                </button>
                <button
                  className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors"
                  onClick={() => onDelete(review.id)}
                  aria-label="Delete review">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-500">You haven't written any reviews yet.</p>
        </div>
      )}
    </div>
  );
};
