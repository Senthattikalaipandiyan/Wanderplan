import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const AdminHome = () => {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([api.get('/admin/analytics'), api.get('/admin/bookings')])
      .then(([a, b]) => { setAnalytics(a.data.analytics); setBookings(b.data.bookings || []); })
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  const recentBookings = bookings.slice(0, 5);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600 }}>Admin Panel 🛡️</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Welcome back, {user?.name?.split(' ')[0]}. System overview.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{analytics?.totalUsers ?? '—'}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-icon">✈️</div>
          <div className="stat-value">{analytics?.totalTrips ?? '—'}</div>
          <div className="stat-label">Total Trips</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">🏨</div>
          <div className="stat-value">{analytics?.totalBookings ?? '—'}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon">🌍</div>
          <div className="stat-value">{analytics?.destinations ?? '—'}</div>
          <div className="stat-label">Destinations</div>
        </div>
      </div>

      <div className="two-col" style={{ marginTop: '1.5rem' }}>
        {/* Users by Role */}
        <div>
          <div className="section-header">
            <span className="section-title">Users by Role</span>
            <button className="section-action" onClick={() => navigate('/admin-dashboard/users')}>Manage</button>
          </div>
          <div className="card">
            {(analytics?.usersByRole || []).map((r) => {
              const colors = { traveler: '#2e86de', manager: '#f0a500', admin: '#e17055' };
              const total  = analytics?.totalUsers || 1;
              return (
                <div key={r._id} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4, textTransform: 'capitalize' }}>
                    <span style={{ fontWeight: 500 }}>{r._id}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{r.count} users</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(r.count / total) * 100}%`, background: colors[r._id] || '#888' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Bookings */}
        <div>
          <div className="section-header">
            <span className="section-title">Recent Bookings</span>
            <button className="section-action" onClick={() => navigate('/admin-dashboard/bookings')}>View All</button>
          </div>
          <div className="card">
            {recentBookings.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>No bookings yet.</div>
            ) : (
              recentBookings.map((b) => (
                <div key={b._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{b.user?.name || 'User'}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{b.details}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>₹{Number(b.cost).toLocaleString('en-IN')}</div>
                    <span className={`badge badge-${b.status === 'confirmed' ? 'blue' : b.status === 'pending' ? 'gold' : 'gray'}`}>{b.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
