import type React from 'react';
import { useState } from 'react';
import { BookCard, Dialog } from '@/common/components';
import { Search } from 'lucide-react';
import type { Book } from '@/common/types';
import { useLazySearchGoogleBooksQuery } from '@/api/google-books-api';

interface BookSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBookSelect: (book: Book) => void;
}

export const BookSearchDialog = ({ isOpen, onClose, onBookSelect }: BookSearchDialogProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [triggerSearch, { data: searchResults, isFetching }] = useLazySearchGoogleBooksQuery();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      triggerSearch(searchTerm);
    }
  };

  const handleBookSelect = (book: Book) => {
    onBookSelect({
      ...book,
      thumbnailUrl: book.thumbnailUrl?.replace('http://', 'https://'),
    });
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Search Books" size="large">
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter book title or author"
            className="w-full border border-gray-200 p-3 pl-10 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            autoFocus
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors">
            Search
          </button>
        </div>
      </form>

      {isFetching ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : searchResults?.length ? (
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
          <p className="text-sm text-gray-500 mb-2">Found {searchResults.length} results. Click on a book to add it.</p>
          {searchResults.map((book) => (
            <div key={book.id} className="hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
              <BookCard book={book} onClick={() => handleBookSelect(book)} />
            </div>
          ))}
        </div>
      ) : (
        searchResults && (
          <div className="text-center py-12">
            <p className="text-gray-500">No results found.</p>
            <p className="text-sm text-gray-400 mt-1">Try a different search term.</p>
          </div>
        )
      )}
    </Dialog>
  );
};
