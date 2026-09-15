import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const TYPE_EMOJI   = { hotel: '🏨', flight: '✈️', activity: '🎯', transport: '🚗' };
const STATUS_BADGE = { pending: 'badge-gold', confirmed: 'badge-blue', cancelled: 'badge-gray' };

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [toast, setToast]       = useState('');
  const [filter, setFilter]     = useState('');

  const fetchBookings = () => {
    api.get('/admin/bookings').then((r) => setBookings(r.data.bookings || [])).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleStatus = async (id, status) => {
    try { await api.put(`/admin/bookings/${id}`, { status }); fetchBookings(); showToast(`Booking ${status}!`); }
    catch { showToast('Error.'); }
  };

  const filtered = filter ? bookings.filter((b) => b.status === filter) : bookings;

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div>
      {toast && <div className="toast">{toast}</div>}

      {/* Stats */}
      <div className="stats-grid">
        {['confirmed', 'pending', 'cancelled'].map((s) => {
          const count  = bookings.filter((b) => b.status === s).length;
          const color  = s === 'confirmed' ? 'green' : s === 'pending' ? 'gold' : 'red';
          const emoji  = s === 'confirmed' ? '✅' : s === 'pending' ? '⏳' : '❌';
          return (
            <div key={s} className={`stat-card ${color}`}>
              <div className="stat-icon">{emoji}</div>
              <div className="stat-value">{count}</div>
              <div className="stat-label" style={{ textTransform: 'capitalize' }}>{s}</div>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, margin: '1.5rem 0 1rem', flexWrap: 'wrap' }}>
        {['', 'confirmed', 'pending', 'cancelled'].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', border: `1px solid ${filter === s ? 'var(--accent-blue)' : 'var(--border)'}`, background: filter === s ? 'var(--accent-blue)' : '#fff', color: filter === s ? '#fff' : 'var(--text-secondary)' }}>
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <table className="data-table">
        <thead>
          <tr><th>Type</th><th>User</th><th>Details</th><th>Check-in</th><th>Cost</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {filtered.map((b) => (
            <tr key={b._id}>
              <td style={{ fontSize: 20 }}>{TYPE_EMOJI[b.type]}</td>
              <td style={{ fontWeight: 500, fontSize: 13 }}>{b.user?.name || '—'}</td>
              <td style={{ fontSize: 12 }}>{b.details}</td>
              <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{b.checkIn ? new Date(b.checkIn).toLocaleDateString() : '—'}</td>
              <td style={{ fontWeight: 600 }}>₹{Number(b.cost).toLocaleString('en-IN')}</td>
              <td><span className={`badge ${STATUS_BADGE[b.status]}`}>{b.status}</span></td>
              <td>
                <div style={{ display: 'flex', gap: 6 }}>
                  {b.status !== 'confirmed' && <button className="btn-sm success" onClick={() => handleStatus(b._id, 'confirmed')}>✓ Confirm</button>}
                  {b.status !== 'cancelled' && <button className="btn-sm danger" onClick={() => handleStatus(b._id, 'cancelled')}>✕ Cancel</button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', marginTop: 12 }}>No bookings found.</div>}
    </div>
  );
};

export default ManageBookings;
