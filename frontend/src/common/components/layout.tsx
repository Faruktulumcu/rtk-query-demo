import { Outlet } from 'react-router';
import { Navbar } from './navbar.tsx';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-2">
        <Outlet />
      </main>
    </div>
  );
};
