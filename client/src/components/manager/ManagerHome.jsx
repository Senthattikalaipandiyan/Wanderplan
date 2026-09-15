import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const ManagerHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips]           = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    api.get('/trips').then((t) => {
      setTrips(t.data.trips || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const pendingTrips = trips.filter((t) => t.status === 'Pending Approval').length;
  const approvedTrips = trips.filter((t) => t.status === 'Approved').length;

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600 }}>Welcome, {user?.name?.split(' ')[0]}! 📋</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Your travel manager overview</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card gold">
          <div className="stat-icon">🗺️</div>
          <div className="stat-value">{trips.length}</div>
          <div className="stat-label">Total Assigned Trips</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{approvedTrips}</div>
          <div className="stat-label">Approved Trips</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">⏳</div>
          <div className="stat-value">{pendingTrips}</div>
          <div className="stat-label">Pending Approval</div>
        </div>
      </div>

      <div className="two-col" style={{ marginTop: '1.5rem' }}>
        {/* Assigned Trips Overview */}
        <div style={{ gridColumn: '1 / -1' }}>
          <div className="section-header">
            <span className="section-title">Recently Assigned Trips</span>
            <button className="section-action" onClick={() => navigate('/manager-dashboard/trips')}>View All</button>
          </div>
          {trips.length === 0 ? (
            <div className="card" style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No trips assigned yet.</div>
          ) : (
            <div className="cards-grid">
              {trips.slice(0, 3).map((trip) => (
                <div key={trip._id} className="card" style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>{trip.coverEmoji || '✈️'}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{trip.destination}, {trip.country}</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    Traveler: {trip.traveler?.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                    📅 {new Date(trip.startDate).toLocaleDateString()}
                  </div>
                  <span className={`badge badge-${trip.status === 'Approved' ? 'green' : 'gold'}`} style={{ marginTop: 8 }}>{trip.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerHome;
