import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import ManagerHome from '../../components/manager/ManagerHome';
import GroupTrips from './GroupTrips';
import SharedItinerary from './SharedItinerary';
import Activities from './Activities';
import ManageTravelers from './ManageTravelers';
import ExpenseReports from './ExpenseReports';
import ManagerTrips from './ManagerTrips';
import Itinerary from '../traveler/Itinerary';
import Expenses from '../traveler/Expenses';

const ManagerDashboard = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <Routes>
            <Route path="/"            element={<ManagerHome />} />
            <Route path="/trips"       element={<ManagerTrips />} />
            <Route path="/trip-itinerary" element={<Itinerary />} />
            <Route path="/trip-expenses"  element={<Expenses />} />
            <Route path="/group-trips" element={<GroupTrips />} />
            <Route path="/itinerary"   element={<SharedItinerary />} />
            <Route path="/activities"  element={<Activities />} />
            <Route path="/travelers"   element={<ManageTravelers />} />
            <Route path="/reports"     element={<ExpenseReports />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
