import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    api.get('/admin/analytics')
      .then((r) => setAnalytics(r.data.analytics))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!analytics) return <div className="card" style={{ color: 'var(--text-secondary)' }}>No analytics data.</div>;

  const roleColors = { traveler: '#2e86de', manager: '#f0a500', admin: '#e17055' };
  const statusColors = { planning: '#f0a500', upcoming: '#2e86de', ongoing: '#00b894', completed: '#888' };

  const maxRoleCount  = Math.max(...(analytics.usersByRole  || []).map((r) => r.count), 1);
  const maxStatusCount = Math.max(...(analytics.tripsByStatus || []).map((s) => s.count), 1);

  const topDestinations = [
    { name: 'Goa, India',       visits: 342, pct: 100 },
    { name: 'Kerala, India',    visits: 218, pct: 64  },
    { name: 'Manali, India',    visits: 156, pct: 46  },
    { name: 'Paris, France',    visits: 89,  pct: 26  },
    { name: 'Kyoto, Japan',     visits: 67,  pct: 20  },
  ];

  return (
    <div>
      {/* Summary stats */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{analytics.totalUsers}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-icon">✈️</div>
          <div className="stat-value">{analytics.totalTrips}</div>
          <div className="stat-label">Total Trips</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">🏨</div>
          <div className="stat-value">{analytics.totalBookings}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon">🌍</div>
          <div className="stat-value">{analytics.destinations}</div>
          <div className="stat-label">Destinations</div>
        </div>
      </div>

      <div className="two-col" style={{ marginTop: '1.5rem' }}>
        {/* Users by Role */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>Users by Role</div>
          {(analytics.usersByRole || []).map((r) => (
            <div key={r._id} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{r._id}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{r.count} users</span>
              </div>
              <div style={{ height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(r.count / maxRoleCount) * 100}%`, background: roleColors[r._id] || '#888', borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Trips by Status */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>Trips by Status</div>
          {(analytics.tripsByStatus || []).map((s) => (
            <div key={s._id} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{s._id}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{s.count} trips</span>
              </div>
              <div style={{ height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(s.count / maxStatusCount) * 100}%`, background: statusColors[s._id] || '#888', borderRadius: 4 }} />
              </div>
            </div>
          ))}
          {(analytics.tripsByStatus || []).length === 0 && (
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, textAlign: 'center', padding: '1rem' }}>No trip data yet.</div>
          )}
        </div>
      </div>

      {/* Top Destinations */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="section-title" style={{ marginBottom: 16 }}>Top Destinations (Sample Data)</div>
        {topDestinations.map((d) => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 13, width: 140, flexShrink: 0, color: 'var(--text-secondary)' }}>{d.name}</span>
            <div style={{ flex: 1, height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${d.pct}%`, background: 'var(--accent-blue)', borderRadius: 4 }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 500, minWidth: 40, textAlign: 'right' }}>{d.visits}</span>
          </div>
        ))}
      </div>

      {/* Monthly bookings bar chart */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="section-title" style={{ marginBottom: 16 }}>Monthly Bookings Trend (Sample)</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
          {[
            { m: 'Jan', v: 40 }, { m: 'Feb', v: 55 }, { m: 'Mar', v: 48 },
            { m: 'Apr', v: 62 }, { m: 'May', v: 75 }, { m: 'Jun', v: 68 },
            { m: 'Jul', v: 85 }, { m: 'Aug', v: 90 }, { m: 'Sep', v: 78 },
            { m: 'Oct', v: 95 }, { m: 'Nov', v: 88 }, { m: 'Dec', v: 100 },
          ].map(({ m, v }) => (
            <div key={m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: '100%', height: `${v}%`, background: 'var(--accent-blue)', borderRadius: '4px 4px 0 0', opacity: 0.85 }} />
              <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
