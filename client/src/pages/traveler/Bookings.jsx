import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const TYPE_EMOJI  = { hotel: '🏨', flight: '✈️', activity: '🎯', transport: '🚗' };
const STATUS_BADGE = { pending: 'badge-gold', confirmed: 'badge-blue', cancelled: 'badge-gray' };

const Bookings = () => {
  const [bookings, setBookings]   = useState([]);
  const [trips, setTrips]         = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast]         = useState('');
  const [form, setForm] = useState({ type: 'hotel', details: '', checkIn: '', checkOut: '', cost: '', trip: '', confirmationNumber: '', notes: '' });

  const fetchData = () => {
    api.get('/bookings').then((r) => setBookings(r.data.bookings || [])).catch(console.error);
    api.get('/trips').then((r) => setTrips(r.data.trips || [])).catch(console.error);
  };

  useEffect(() => { fetchData(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bookings', form);
      setShowModal(false);
      setForm({ type: 'hotel', details: '', checkIn: '', checkOut: '', cost: '', trip: '', confirmationNumber: '', notes: '' });
      fetchData();
      showToast('Booking added!');
    } catch (err) { showToast(err.response?.data?.message || 'Error creating booking.'); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try { await api.delete(`/bookings/${id}`); fetchData(); showToast('Booking cancelled.'); }
    catch { showToast('Error.'); }
  };

  return (
    <div>
      {toast && <div className="toast">{toast}</div>}

      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <span className="section-title">My Bookings ({bookings.length})</span>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Booking</button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {['confirmed', 'pending', 'cancelled'].map((status) => {
          const count = bookings.filter((b) => b.status === status).length;
          const colors = { confirmed: 'green', pending: 'gold', cancelled: 'red' };
          return (
            <div key={status} className={`stat-card ${colors[status]}`}>
              <div className="stat-icon">{status === 'confirmed' ? '✅' : status === 'pending' ? '⏳' : '❌'}</div>
              <div className="stat-value">{count}</div>
              <div className="stat-label" style={{ textTransform: 'capitalize' }}>{status}</div>
            </div>
          );
        })}
      </div>

      {bookings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏨</div>
          <p>No bookings yet.</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr><th>Type</th><th>Details</th><th>Check-in</th><th>Check-out</th><th>Cost</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td style={{ fontSize: 20 }}>{TYPE_EMOJI[b.type]}</td>
                <td style={{ fontWeight: 500 }}>{b.details}</td>
                <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{b.checkIn ? new Date(b.checkIn).toLocaleDateString() : '—'}</td>
                <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{b.checkOut ? new Date(b.checkOut).toLocaleDateString() : '—'}</td>
                <td style={{ fontWeight: 600 }}>₹{Number(b.cost).toLocaleString('en-IN')}</td>
                <td><span className={`badge ${STATUS_BADGE[b.status]}`}>{b.status}</span></td>
                <td><button className="btn-sm danger" onClick={() => handleCancel(b._id)}>Cancel</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="modal-title">🏨 New Booking</div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {['hotel', 'flight', 'activity', 'transport'].map((t) => <option key={t} value={t}>{TYPE_EMOJI[t]} {t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Details</label>
                <input className="form-input" placeholder="Hotel name / Flight number" value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Trip (optional)</label>
                <select className="form-input" value={form.trip} onChange={(e) => setForm({ ...form, trip: e.target.value })}>
                  <option value="">— Select Trip —</option>
                  {trips.map((t) => <option key={t._id} value={t._id}>{t.destination}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Check-in / Date</label>
                  <input className="form-input" type="date" value={form.checkIn} onChange={(e) => setForm({ ...form, checkIn: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Check-out</label>
                  <input className="form-input" type="date" value={form.checkOut} onChange={(e) => setForm({ ...form, checkOut: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Cost (₹)</label>
                <input className="form-input" type="number" min="0" placeholder="0" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Confirmation Number</label>
                <input className="form-input" placeholder="Optional" value={form.confirmationNumber} onChange={(e) => setForm({ ...form, confirmationNumber: e.target.value })} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-sm outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-sm primary">Add Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
