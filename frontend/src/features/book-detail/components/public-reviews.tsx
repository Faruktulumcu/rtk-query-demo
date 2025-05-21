import type { Review } from '@/common/types';
import { ReviewItem } from '@/common/components';

type PublicReviewsProps = {
  reviews: Review[];
};

export const PublicReviews = ({ reviews }: PublicReviewsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium mb-4 text-gray-800 flex items-center">
        Public Reviews
        {reviews.length > 0 && (
          <span className="ml-2 text-sm bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{reviews.length}</span>
        )}
      </h2>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded-lg p-4">
              <ReviewItem review={review} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-500">No public reviews yet.</p>
        </div>
      )}
    </div>
  );
};
