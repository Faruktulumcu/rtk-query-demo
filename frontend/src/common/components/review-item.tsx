import type { Review } from '@/common/types';
import { formatDate } from '@/common/utils';

type ReviewItemProps = {
  review: Review;
  isOwner?: boolean;
};

export const ReviewItem = ({ review, isOwner = false }: ReviewItemProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <time className="text-xs text-gray-500">{formatDate(review.createdAt)}</time>
        <div className="flex gap-2">
          {!isOwner && review.public && (
            <span className="text-sm px-2 py-0.5 bg-green-50 text-green-600 rounded-full capitalize">
              {review.username}
            </span>
          )}
          {isOwner && !review.public && (
            <span className="text-sm px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full capitalize">Private</span>
          )}
          {isOwner && review.public && (
            <span className="text-sm px-2 py-0.5 bg-green-50 text-green-600 rounded-full capitalize">Public</span>
          )}
        </div>
      </div>
      <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">{review.content}</p>
    </div>
  );
};
