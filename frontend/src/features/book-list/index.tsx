import { useAddBookMutation, useGetBooksQuery } from '@/api/books-api';
import { useNavigate } from 'react-router';
import { BookCard } from '@/common/components';
import { useState } from 'react';
import type { Book } from '@/common/types';
import { BookSearchDialog } from './components/book-search-dialog';
import { Plus } from 'lucide-react';

export const BookListPage = () => {
  const navigate = useNavigate();
  const { data: books, isLoading, isError } = useGetBooksQuery();
  const [addBook] = useAddBookMutation();

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleAddBook = async (book: Book) => {
    await addBook({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      thumbnailUrl: book.thumbnailUrl,
    });
    closeModal();
  };

  const goToDetail = (id: string) => () => navigate(`/detail/${id}`);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Books</h1>

        <button
          type="button"
          onClick={openModal}
          className="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          <Plus size={18} />
          Add Book
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : isError ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">Failed to load books.</div>
      ) : books?.length ? (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {books.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <BookCard book={book} onClick={goToDetail(book.id)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-12 text-center border border-dashed border-gray-300">
          <p className="text-gray-600 mb-2">No books found in your collection.</p>
          <p className="text-gray-500 text-sm">Click the "Add Book" button to get started.</p>
        </div>
      )}

      <BookSearchDialog isOpen={isModalOpen} onClose={closeModal} onBookSelect={handleAddBook} />
    </div>
  );
};
