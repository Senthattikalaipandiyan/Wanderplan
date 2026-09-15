import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const ExpenseReports = () => {
  const navigate = useNavigate();
  const [trips, setTrips]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/manager/group-trips').then((r) => setTrips(r.data.trips || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const totalBudget = trips.reduce((s, t) => s + (t.totalBudget || 0), 0);
  const totalSpent  = trips.reduce((s, t) => s + (t.spentAmount || 0), 0);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div>
      <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="section-title">Expense Reports</span>
        <button className="btn btn-primary" onClick={() => navigate('/manager-dashboard/trip-expenses')}>+ Manage Expenses</button>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card gold">
          <div className="stat-icon">💼</div>
          <div className="stat-value">₹{totalBudget.toLocaleString('en-IN')}</div>
          <div className="stat-label">Total Budget (All Trips)</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon">📤</div>
          <div className="stat-value">₹{totalSpent.toLocaleString('en-IN')}</div>
          <div className="stat-label">Total Spent</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">💰</div>
          <div className="stat-value">₹{(totalBudget - totalSpent).toLocaleString('en-IN')}</div>
          <div className="stat-label">Remaining</div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <div className="section-title" style={{ marginBottom: 12 }}>Group Trip Budget Breakdown</div>
        {trips.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No group trips yet.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Trip</th><th>Destination</th><th>Travelers</th><th>Budget</th><th>Spent</th><th>Remaining</th><th>Status</th></tr>
            </thead>
            <tbody>
              {trips.map((trip) => {
                const rem  = (trip.totalBudget || 0) - (trip.spentAmount || 0);
                const pct  = trip.totalBudget ? Math.min(((trip.spentAmount || 0) / trip.totalBudget) * 100, 100) : 0;
                return (
                  <tr key={trip._id}>
                    <td style={{ fontWeight: 500 }}>{trip.name}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{trip.destination}, {trip.country}</td>
                    <td style={{ fontSize: 12 }}>👥 {trip.travelers?.length || 0}</td>
                    <td style={{ fontWeight: 500 }}>₹{(trip.totalBudget || 0).toLocaleString('en-IN')}</td>
                    <td>₹{(trip.spentAmount || 0).toLocaleString('en-IN')}</td>
                    <td style={{ color: rem >= 0 ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 500 }}>
                      ₹{rem.toLocaleString('en-IN')}
                    </td>
                    <td>
                      <div style={{ minWidth: 80 }}>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${pct}%`, background: pct > 90 ? 'var(--accent-red)' : 'var(--accent-blue)' }} />
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>{Math.round(pct)}% used</div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ExpenseReports;
