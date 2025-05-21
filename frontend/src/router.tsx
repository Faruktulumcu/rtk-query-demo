import { createBrowserRouter } from 'react-router';
import { BookListPage } from '@/features/book-list';
import { BookDetailPage } from '@/features/book-detail';
import { Layout, ProtectedRoute } from '@/common/components';
import { LoginPage } from '@/features/login';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          { path: '', element: <BookListPage /> },
          { path: 'detail/:id', element: <BookDetailPage /> },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);
