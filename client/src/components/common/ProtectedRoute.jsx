import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Spinner = () => (
  <div className="spinner-wrap">
    <div className="spinner" />
  </div>
);

// Role-dashboard redirect map
const roleHome = {
  traveler: '/traveler-dashboard',
  manager: '/manager-dashboard',
  admin: '/admin-dashboard',
};

/**
 * ProtectedRoute
 * - If loading: show spinner
 * - If not logged in: redirect to /login
 * - If wrong role: redirect to own dashboard
 * - Otherwise: render children
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={roleHome[user.role]} replace />;
  }

  return children;
};

export default ProtectedRoute;
