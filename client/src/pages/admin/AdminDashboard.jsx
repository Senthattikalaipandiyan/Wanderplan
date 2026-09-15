import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import AdminHome from '../../components/admin/AdminHome';
import ManageUsers from './ManageUsers';
import ManageDestinations from './ManageDestinations';
import ManageBookings from './ManageBookings';
import Analytics from './Analytics';
import Reports from './Reports';
import ActivityLog from './ActivityLog';
import ManageTrips from './ManageTrips';

const AdminDashboard = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <Routes>
            <Route path="/"            element={<AdminHome />} />
            <Route path="/users"       element={<ManageUsers />} />
            <Route path="/destinations" element={<ManageDestinations />} />
            <Route path="/bookings"    element={<ManageBookings />} />
            <Route path="/trips"       element={<ManageTrips />} />
            <Route path="/analytics"   element={<Analytics />} />
            <Route path="/reports"     element={<Reports />} />
            <Route path="/activity-log" element={<ActivityLog />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
