import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/core/store';
import { ROUTES } from '@/core/constants';

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};
export default ProtectedRoute;
