import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Navigation items per role
const navConfig = {
  traveler: [
    { id: 'home',      label: 'Dashboard',          icon: '🏠', path: '' },
    { id: 'search',    label: 'Search Destinations', icon: '🔍', path: '/search' },
    { id: 'trips',     label: 'My Trips',            icon: '🗺️', path: '/trips' },
    { id: 'itinerary', label: 'Itinerary',           icon: '📅', path: '/itinerary' },
    { id: 'expenses',  label: 'Expenses',            icon: '💰', path: '/expenses' },
    { id: 'bookings',  label: 'Bookings',            icon: '🏨', path: '/bookings' },
    { id: 'profile',   label: 'Profile',             icon: '👤', path: '/profile' },
  ],
  manager: [
    { id: 'home',        label: 'Dashboard',         icon: '🏠', path: '' },
    { id: 'trips',       label: 'Assigned Trips',    icon: '🗺️', path: '/trips' },
    { id: 'group-trips', label: 'Group Trips',       icon: '👥', path: '/group-trips' },
    { id: 'itinerary',   label: 'Shared Itinerary',  icon: '📋', path: '/itinerary' },
    { id: 'activities',  label: 'Activities',        icon: '🎯', path: '/activities' },
    { id: 'travelers',   label: 'Manage Travelers',  icon: '🧳', path: '/travelers' },
    { id: 'reports',     label: 'Expense Reports',   icon: '📊', path: '/reports' },
  ],
  admin: [
    { id: 'home',         label: 'Dashboard',        icon: '🏠', path: '' },
    { id: 'trips',        label: 'Trip Workflow',    icon: '🗺️', path: '/trips' },
    { id: 'users',        label: 'Manage Users',     icon: '👥', path: '/users' },
    { id: 'destinations', label: 'Destinations',     icon: '🌍', path: '/destinations' },
    { id: 'bookings',     label: 'Bookings',         icon: '🏨', path: '/bookings' },
    { id: 'analytics',    label: 'Analytics',        icon: '📈', path: '/analytics' },
    { id: 'reports',      label: 'Reports',          icon: '📄', path: '/reports' },
    { id: 'activity-log', label: 'Activity Log',     icon: '🔍', path: '/activity-log' },
  ],
};

const roleColors = { traveler: '#2e86de', manager: '#f0a500', admin: '#e17055' };
const roleLabels = { traveler: 'Traveler Portal', manager: 'Manager Portal', admin: 'Admin Panel' };
const basePaths  = { traveler: '/traveler-dashboard', manager: '/manager-dashboard', admin: '/admin-dashboard' };

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const navItems = navConfig[user.role] || [];
  const basePath = basePaths[user.role];
  const color    = roleColors[user.role];
  const initials = user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const handleNav = (path) => navigate(basePath + path);

  const isActive = (path) => {
    const full = basePath + path;
    if (path === '') return location.pathname === basePath || location.pathname === basePath + '/';
    return location.pathname.startsWith(full);
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <h2>✈ WanderPlan</h2>
        <p>{roleLabels[user.role]}</p>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar" style={{ background: color }}>{initials}</div>
        <div className="user-info">
          <div className="user-name">{user.name}</div>
          <div className="user-role-badge" style={{ background: color + '22', color }}>
            {user.role}
          </div>
        </div>
      </div>

      <div className="sidebar-nav">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => handleNav(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>

      <div className="sidebar-bottom">
        <button className="logout-btn" onClick={handleLogout}>
          <span>⬅</span> Logout
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
