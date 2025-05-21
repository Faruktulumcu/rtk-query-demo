import { useAuth } from '@/common/hooks/use-auth';
import { Navigate, Outlet } from 'react-router';

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
