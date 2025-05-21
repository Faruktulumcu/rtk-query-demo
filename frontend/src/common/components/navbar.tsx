'use client';

import { LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '@/common/hooks/use-auth.ts';

export const Navbar = () => {
  const location = useLocation();
  const { username, handleLogout } = useAuth();

  return (
    <nav className="navbar-bg p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/"
            className={`mr-6 text-white font-medium hover:text-blue-200 transition-colors ${
              location.pathname === '/' ? 'border-b-2 border-white' : ''
            }`}>
            Home
          </Link>
        </div>

        <div className="flex items-center">
          {username && (
            <>
              <span className="text-white mr-4">Hello, {username.toUpperCase()}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-white hover:text-blue-200 transition-colors p-2 rounded-full hover:bg-blue-700"
                aria-label="Logout">
                <LogOut size={24} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
