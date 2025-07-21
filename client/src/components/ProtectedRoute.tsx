import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks';
import { getCurrentUser } from '../store/slices/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isAuthenticated, isLoading, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token && !isAuthenticated && !isLoading) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token, isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;