import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TravelerDashboard from './pages/traveler/TravelerDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';

// Loading spinner
const Spinner = () => (
  <div className="spinner-wrap">
    <div className="spinner" />
  </div>
);

// ─── Auto-redirect to role dashboard ─────────────────────
const RoleRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  const map = { traveler: '/traveler-dashboard', manager: '/manager-dashboard', admin: '/admin-dashboard' };
  return <Navigate to={map[user.role]} replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<RoleRedirect />} />

          {/* Traveler only */}
          <Route
            path="/traveler-dashboard/*"
            element={
              <ProtectedRoute allowedRoles={['traveler']}>
                <TravelerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Manager only */}
          <Route
            path="/manager-dashboard/*"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin only */}
          <Route
            path="/admin-dashboard/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
