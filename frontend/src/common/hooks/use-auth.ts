import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '@/store';
import { logout } from '@/store/auth-slice';
import { baseApi } from '@/api/base-api.ts';
import { authApi } from '@/api/auth-api.ts';
import { googleBooksApi } from '@/api/google-books-api.ts';

export function useAuth() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    dispatch(authApi.util.resetApiState());
    dispatch(googleBooksApi.util.resetApiState());
  };

  return { username: user?.username, isAuthenticated: !!user?.token, handleLogout };
}
