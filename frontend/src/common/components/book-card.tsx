'use client';

import type * as React from 'react';
import type { Book } from '@/common/types';
import { BookOpen } from 'lucide-react';

type Props = {
  book: Book;
  onClick?: () => void;
};

export const BookCard: React.FC<Props> = ({ book, onClick }) => {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-md p-4 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-gray-300 hover:shadow-sm' : ''
      }`}
      onClick={onClick}>
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-16 h-24 bg-gray-50 rounded border border-gray-100 flex items-center justify-center overflow-hidden">
            {book.thumbnailUrl ? (
              <img
                src={book.thumbnailUrl || '/placeholder.svg'}
                alt={`Cover of ${book.title}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <BookOpen className="text-gray-400" size={24} />
            )}
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-lg font-medium text-gray-900 leading-tight">{book.title}</h2>
          <p className="text-sm text-gray-700">by {book.author}</p>
          <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
        </div>
      </div>
    </div>
  );
};
