import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router';
import { router } from '@/router.tsx';
import { Provider } from 'react-redux';
import { store } from '@/store';

// MSW: Only start in development
async function prepare() {
  const useMocks = import.meta.env.VITE_API_MODE === 'mock';

  if (import.meta.env.DEV && useMocks) {
    const { worker } = await import('@/mocks/browser');
    await worker.start({
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
      onUnhandledRequest(request) {
        if (request.destination === 'image') return;
        if (request.url.includes('books.google.com')) return;
        console.warn(`[MSW] Warning: unhandled request to ${request.method} ${request.url}`);
      },
    });
  }
}

prepare().then(() => {
  createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>,
  );
});
