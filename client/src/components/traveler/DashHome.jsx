import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const DashHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips]       = useState([]);
  const [bookings, setBookings] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/trips'),
      api.get('/bookings'),
      api.get('/expenses'),
    ]).then(([t, b, e]) => {
      setTrips(t.data.trips || []);
      setBookings(b.data.bookings || []);
      setExpenses(e.data.expenses || []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const upcomingTrips  = trips.filter((t) => t.status === 'upcoming' || t.status === 'planning');
  const totalSpent     = expenses.reduce((s, e) => s + e.amount, 0);
  const confirmedBooks = bookings.filter((b) => b.status === 'confirmed').length;

  const destinations = [
    { emoji: '🌴', name: 'Goa', country: 'India' },
    { emoji: '🗼', name: 'Paris', country: 'France' },
    { emoji: '🏔️', name: 'Manali', country: 'India' },
    { emoji: '🌊', name: 'Maldives', country: 'Maldives' },
    { emoji: '🏯', name: 'Kyoto', country: 'Japan' },
    { emoji: '🌅', name: 'Santorini', country: 'Greece' },
  ];

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600 }}>Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Here's your travel summary</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">✈️</div>
          <div className="stat-value">{upcomingTrips.length}</div>
          <div className="stat-label">Upcoming Trips</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-icon">🗺️</div>
          <div className="stat-value">{trips.length}</div>
          <div className="stat-label">Total Trips</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">🏨</div>
          <div className="stat-value">{confirmedBooks}</div>
          <div className="stat-label">Confirmed Bookings</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon">💰</div>
          <div className="stat-value">₹{totalSpent.toLocaleString('en-IN')}</div>
          <div className="stat-label">Total Spent</div>
        </div>
      </div>

      {/* Upcoming Trips */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="section-header">
          <span className="section-title">Upcoming Trips</span>
          <button className="section-action" onClick={() => navigate('/traveler-dashboard/trips')}>View All</button>
        </div>
        {upcomingTrips.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
            No upcoming trips. <span style={{ color: 'var(--accent-blue)', cursor: 'pointer' }} onClick={() => navigate('/traveler-dashboard/trips')}>Plan one now!</span>
          </div>
        ) : (
          <div className="cards-grid">
            {upcomingTrips.slice(0, 3).map((trip) => (
              <div key={trip._id} className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('/traveler-dashboard/trips')}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{trip.coverEmoji || '✈️'}</div>
                <div style={{ fontWeight: 500 }}>{trip.destination}, {trip.country}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                  {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}
                </div>
                <div style={{ marginTop: 8 }}>
                  <span className={`badge badge-${trip.status === 'upcoming' ? 'blue' : 'gold'}`}>{trip.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Destinations */}
      <div>
        <div className="section-header">
          <span className="section-title">Recommended Destinations</span>
          <button className="section-action" onClick={() => navigate('/traveler-dashboard/search')}>Explore All</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
          {destinations.map((d) => (
            <div key={d.name} className="card" style={{ textAlign: 'center', cursor: 'pointer', padding: '1rem 0.75rem' }}
              onClick={() => navigate('/traveler-dashboard/search')}>
              <div style={{ fontSize: 30, marginBottom: 6 }}>{d.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{d.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{d.country}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashHome;
