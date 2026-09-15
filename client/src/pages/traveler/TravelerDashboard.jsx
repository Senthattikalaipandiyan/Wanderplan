import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import DashHome from '../../components/traveler/DashHome';
import MyTrips from './MyTrips';
import Itinerary from './Itinerary';
import Expenses from './Expenses';
import Bookings from './Bookings';
import Profile from './Profile';
import SearchDestinations from './SearchDestinations';

const TravelerDashboard = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <Routes>
            <Route path="/"            element={<DashHome />} />
            <Route path="/search"      element={<SearchDestinations />} />
            <Route path="/trips"       element={<MyTrips />} />
            <Route path="/itinerary"   element={<Itinerary />} />
            <Route path="/expenses"    element={<Expenses />} />
            <Route path="/bookings"    element={<Bookings />} />
            <Route path="/profile"     element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default TravelerDashboard;
