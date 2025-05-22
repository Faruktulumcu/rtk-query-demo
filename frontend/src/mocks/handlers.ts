// handlers.ts
import { http, HttpResponse } from 'msw';
import type { Book, Review, User } from '@/common/types.ts';

const users: User[] = [
  { id: '1', username: 'alice', token: 'token-alice' },
  { id: '2', username: 'bob', token: 'token-bob' },
  { id: '3', username: 'carol', token: 'token-carol' },
];

const books: Book[] = [
  {
    id: 'b1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '9783826655487',
    thumbnailUrl: 'https://books.google.com/books/content?id=HGxKPgAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
  },
  {
    id: 'b2',
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt',
    isbn: '9780132119177',
    thumbnailUrl: 'https://books.google.com/books/content?id=5wBQEp6ruIAC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
  },
];

const userBooks = [
  { userId: '1', book: books[0] },
  { userId: '1', book: books[1] },
  { userId: '2', book: books[1] },
];

const reviews: Review[] = [
  { id: 'r1', bookId: 'b1', userId: '1', username: 'alice', content: 'Great book!', public: true, createdAt: '2025-05-01T11:45:00Z' },
  { id: 'r2', bookId: 'b1', userId: '1', username: 'alice', content: 'My personal notes...', public: false, createdAt: '2025-05-02T20:13:00Z' },
  { id: 'r3', bookId: 'b2', userId: '2', username: 'bob', content: 'Loved the patterns.', public: true, createdAt: '2025-05-03T14:53:00Z' },
];

let nextBookId = 3;
let nextReviewId = 4;

function getUserOrThrowUnauthorized(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const user = users.find((u) => `Bearer ${u.token}` === authHeader);
  if (!user) throw new HttpResponse('Unauthorized', { status: 401 });
  return user;
}

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
    const result = userBooks.filter((ub) => ub.userId === user.id).map((ub) => ub.book);
    return HttpResponse.json(result);
  }),

  // POST /api/books
  http.post('/api/books', async ({ request }) => {
    const user = getUserOrThrowUnauthorized(request);
    const body = await request.json() as Book;
    const book = {
      id: `b${nextBookId++}`,
      title: body.title,
      author: body.author,
      isbn: body.isbn,
      thumbnailUrl: body.thumbnailUrl,
    };
    books.push(book);
    userBooks.push({ userId: user.id, book });
    return new HttpResponse(JSON.stringify({ userId: user.id, book }), { status: 201 });
  }),

  // GET /api/books/:id
  http.get('/api/books/:id', ({ request, params }) => {
    const user = getUserOrThrowUnauthorized(request);
    const id = params.id as string;
    const userBook = userBooks.find((ub) => ub.userId === user.id && ub.book.id === id);
    if (!userBook) return new HttpResponse('Book not found', { status: 404 });
    return HttpResponse.json(userBook.book);
  }),

  // GET /api/books/:id/reviews
  http.get('/api/books/:id/reviews', ({ request, params }) => {
    const user = getUserOrThrowUnauthorized(request);
    const bookId = params.id as string;
    const userReviews = reviews
      .filter((r) => r.bookId === bookId && r.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return HttpResponse.json(userReviews);
  }),

  // POST /api/books/:id/reviews
  http.post('/api/books/:id/reviews', async ({ request, params }) => {
    const user = getUserOrThrowUnauthorized(request);
    const bookId = params.id as string;
    const { content, public: isPublic } = await request.json() as Partial<Review>;
    const newReview = {
      id: `r${nextReviewId++}`,
      bookId,
      userId: user.id,
      username: user.username,
      content: content || '',
      public: Boolean(isPublic),
      createdAt: new Date().toISOString(),
    };
    reviews.push(newReview);
    return new HttpResponse(JSON.stringify(newReview), { status: 201 });
  }),

  // GET /api/books/:isbn/public-reviews
  http.get('/api/books/:isbn/public-reviews', ({ request, params }) => {
    const user = getUserOrThrowUnauthorized(request);
    const isbn = params.isbn as string;
    const book = userBooks.find((ub) => ub.book.isbn === isbn)?.book;
    if (!book) return new HttpResponse('Book not found', { status: 404 });

    const publicReviews = reviews
      .filter((r) => r.bookId === book.id && r.public && r.userId !== user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return HttpResponse.json(publicReviews);
  }),

  // PUT /api/books/:bookId/reviews/:reviewId
  http.put('/api/books/:bookId/reviews/:reviewId', async ({ request, params }) => {
    const user = getUserOrThrowUnauthorized(request);
    const { bookId, reviewId } = params;
    const index = reviews.findIndex((r) => r.id === reviewId && r.bookId === bookId && r.userId === user.id);
    if (index === -1) return new HttpResponse('Review not found or not owned by user', { status: 404 });

    const body = await request.json() as Partial<Review>;
    reviews[index] = { ...reviews[index], content: body.content || '', public: Boolean(body.public) };
    return HttpResponse.json(reviews[index]);
  }),

  // DELETE /api/books/:bookId/reviews/:reviewId
  http.delete('/api/books/:bookId/reviews/:reviewId', ({ request, params }) => {
    const user = getUserOrThrowUnauthorized(request);
    const { bookId, reviewId } = params;
    const index = reviews.findIndex((r) => r.id === reviewId && r.bookId === bookId && r.userId === user.id);
    if (index === -1) return new HttpResponse('Review not found or not owned by user', { status: 404 });

    reviews.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
