import { http, HttpResponse } from 'msw';
import type { Book, User } from '@/common/types.ts';

interface UserReview {
  id: string;
  bookId: string;
  userId: string;
  content: string;
  isPublic: boolean;
}

// --- In-memory Data ---
const users: User[] = [
  { id: '1', username: 'alice', token: 'token-alice' },
  { id: '2', username: 'bob', token: 'token-bob' },
  { id: '3', username: 'carol', token: 'token-carol' },
];

interface UserBook extends Book {
  userId: User['id'];
}

const books: Book[] = [
  {
    id: 'b1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '9783826655487',
    thumbnailUrl:
      'https://books.google.com/books/content?id=HGxKPgAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
  },
  {
    id: 'b2',
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt',
    isbn: '9780132119177',
    thumbnailUrl:
      'https://books.google.com/books/content?id=5wBQEp6ruIAC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
  },
];

export const userBooks: UserBook[] = [
  { ...books[0], userId: users[0].id },
  { ...books[1], userId: users[0].id },
  { ...books[0], userId: users[1].id },
];

const reviews: UserReview[] = [
  { id: 'r1', bookId: 'b1', userId: '1', content: 'Great book!', isPublic: true },
  { id: 'r2', bookId: 'b1', userId: '1', content: 'My personal notes...', isPublic: false },
  { id: 'r3', bookId: 'b2', userId: '2', content: 'Loved the patterns.', isPublic: true },
];

let nextReviewId = 4;
let nextBookId = 3;

// --- Helpers ---
function getUserFromAuthHeader(request: Request): User | undefined {
  const auth = request.headers.get('Authorization');
  const token = auth?.replace('Bearer ', '');
  return users.find((u) => u.token === token);
}

function getUserOrThrowUnauthorized(request: Request): User {
  const user = getUserFromAuthHeader(request);
  if (!user) throw new HttpResponse('Unauthorized', { status: 401 });
  return user;
}

// --- Handlers ---
export const handlers = [
  // POST /api/login
  http.post('/api/login', async ({ request }) => {
    const { username, password } = (await request.json()) as { username: string; password: string };
    const user = users.find((u) => u.username === username);
    if (user && password === 'demo') {
      return HttpResponse.json({ token: user.token, userId: user.id, username: user.username });
    }
    return new HttpResponse('Invalid credentials', { status: 401 });
  }),

  // GET /api/books
  http.get('/api/books', ({ request }) => {
    const user = getUserOrThrowUnauthorized(request);
    return HttpResponse.json([...userBooks].filter((userBook) => userBook.userId === user.id));
  }),

  // POST /api/books
  http.post('/api/books', async ({ request }) => {
    const user = getUserOrThrowUnauthorized(request);
    const book = (await request.json()) as Omit<Book, 'id'>;
    const newBook: UserBook = {
      ...book,
      id: `b${nextBookId++}`,
      userId: user.id,
    };
    userBooks.push(newBook);
    return HttpResponse.json(newBook, { status: 201 });
  }),

  // GET /api/books/:id
  http.get('/api/books/:id', ({ request, params }) => {
    const user = getUserOrThrowUnauthorized(request);
    const { id } = params;
    const book = userBooks.find((b) => b.id === id && b.userId === user.id);
    if (!book) return new HttpResponse('Book not found', { status: 404 });
    return HttpResponse.json(book);
  }),

  // GET /api/books/:id/my-reviews
  http.get('/api/books/:id/my-reviews', ({ request, params }) => {
    const user = getUserOrThrowUnauthorized(request);
    const { id } = params;
    const myReviews = reviews.filter((r) => r.bookId === id && r.userId === user.id);
    return HttpResponse.json(myReviews);
  }),

  // POST /api/books/:id/reviews
  http.post('/api/books/:id/reviews', async ({ request, params }) => {
    const user = getUserOrThrowUnauthorized(request);
    const { id } = params;
    const { content, isPublic } = (await request.json()) as { content: string; isPublic: boolean };
    const newReview: UserReview = {
      id: `r${nextReviewId++}`,
      bookId: id as string,
      userId: user.id,
      content,
      isPublic,
    };
    reviews.push(newReview);
    return HttpResponse.json(newReview, { status: 201 });
  }),

  // GET /api/most-read-books
  http.get('/api/most-read-books', () => {
    const sorted = userBooks.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10)).slice(0, 5);
    return HttpResponse.json(sorted);
  }),

  // GET /api/books/:isbn/public-reviews
  http.get('/api/books/:isbn/public-reviews', ({ params }) => {
    const { isbn } = params;
    const book = userBooks.find((b) => b.isbn === isbn);
    if (!book) return new HttpResponse('Book not found', { status: 404 });

    const publicReviews = reviews.filter((r) => r.bookId === book.id && r.isPublic);
    return HttpResponse.json(publicReviews);
  }),
];
