import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

//ProtectedRoute is a component that is used to protect the routes
//allowedRoles is an array of roles that are allowed to access the route
// if no role is provided, then any authenticated user can access the route
// if a role is provided, then only the user with that role can access the route
// if the user is not authenticated, then the user will be redirected to the login page
// if the user is authenticated but not in the allowed roles, then the user will be redirected to the home page
// if the user is authenticated and in the allowed roles, then the user will be allowed to access the route
const ProtectedRoute = ({ children, allowedRoles }) => {
  // useAuth is a custom hook that is used to get the user's authentication status
  // useLocation is a hook that is used to get the current location
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;