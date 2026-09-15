import React from 'react';
import { useLocation } from 'react-router-dom';

// Map path segments to readable titles
const titleMap = {
  '':             'Dashboard',
  'search':       'Search Destinations',
  'trips':        'My Trips',
  'itinerary':    'Itinerary',
  'expenses':     'Expense Tracker',
  'bookings':     'My Bookings',
  'profile':      'Profile',
  'group-trips':  'Group Trips',
  'activities':   'Activities',
  'travelers':    'Manage Travelers',
  'reports':      'Reports',
  'users':        'Manage Users',
  'destinations': 'Destinations',
  'analytics':    'Analytics',
  'activity-log': 'Activity Log',
};

const Navbar = () => {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);
  const last  = parts[parts.length - 1] || '';
  // Detect if last segment is a dashboard root
  const title = titleMap[last] || 'Dashboard';
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="top-bar">
      <h1>{title}</h1>
      <div className="top-bar-right">
        <span>📅 {today}</span>
      </div>
    </div>
  );
};

export default Navbar;
