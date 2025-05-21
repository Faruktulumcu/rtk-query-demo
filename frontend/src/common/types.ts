export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  thumbnailUrl?: string;
}

export interface User {
  id: string;
  username: string;
  token: string;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  username: string;
  content: string;
  public: boolean;
  createdAt: string;
}
