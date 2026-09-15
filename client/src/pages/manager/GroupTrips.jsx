import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const GroupTrips = () => {
  const [trips, setTrips]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast]         = useState('');
  const [form, setForm] = useState({ name: '', destination: '', country: '', startDate: '', endDate: '', maxTravelers: 20, totalBudget: '' });

  const fetchTrips = () => {
    api.get('/manager/group-trips').then((r) => setTrips(r.data.trips || [])).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchTrips(); }, []);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/manager/group-trips', form);
      setShowModal(false);
      setForm({ name: '', destination: '', country: '', startDate: '', endDate: '', maxTravelers: 20, totalBudget: '' });
      fetchTrips();
      showToast('Group trip created!');
    } catch (err) { showToast(err.response?.data?.message || 'Error.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this group trip?')) return;
    try { await api.delete(`/manager/group-trips/${id}`); fetchTrips(); showToast('Deleted.'); }
    catch { showToast('Error.'); }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div>
      {toast && <div className="toast">{toast}</div>}
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <span className="section-title">Group Trips ({trips.length})</span>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Create Group Trip</button>
      </div>

      {trips.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
          <p>No group trips yet. Create your first one!</p>
        </div>
      ) : (
        <div className="cards-grid">
          {trips.map((trip) => (
            <div key={trip._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{trip.name}</div>
                <span className={`badge badge-${trip.status === 'active' ? 'green' : trip.status === 'completed' ? 'gray' : 'gold'}`}>{trip.status}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>📍 {trip.destination}, {trip.country}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                📅 {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}
              </div>
              <div style={{ fontSize: 13, marginBottom: 4 }}>
                👥 {trip.travelers?.length || 0} / {trip.maxTravelers} travelers
              </div>
              <div className="progress-bar" style={{ marginBottom: 8 }}>
                <div className="progress-fill" style={{ width: `${Math.min(((trip.travelers?.length || 0) / (trip.maxTravelers || 1)) * 100, 100)}%` }} />
              </div>
              {trip.totalBudget > 0 && (
                <div style={{ fontSize: 12, color: 'var(--accent-blue)', fontWeight: 500, marginBottom: 12 }}>
                  Budget: ₹{Number(trip.totalBudget).toLocaleString('en-IN')}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-sm outline" style={{ flex: 1 }} onClick={() => showToast('Edit coming soon!')}>Edit</button>
                <button className="btn-sm danger" onClick={() => handleDelete(trip._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="modal-title">👥 Create Group Trip</div>
            <form onSubmit={handleCreate}>
              <div className="form-group"><label className="form-label">Trip Name</label>
                <input className="form-input" placeholder="e.g. Kerala Backwaters Tour" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="form-group"><label className="form-label">Destination</label>
                <input className="form-input" placeholder="e.g. Kerala" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} required /></div>
              <div className="form-group"><label className="form-label">Country</label>
                <input className="form-input" placeholder="e.g. India" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group"><label className="form-label">Start Date</label>
                  <input className="form-input" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required /></div>
                <div className="form-group"><label className="form-label">End Date</label>
                  <input className="form-input" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group"><label className="form-label">Max Travelers</label>
                  <input className="form-input" type="number" min="1" value={form.maxTravelers} onChange={(e) => setForm({ ...form, maxTravelers: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Total Budget (₹)</label>
                  <input className="form-input" type="number" min="0" placeholder="0" value={form.totalBudget} onChange={(e) => setForm({ ...form, totalBudget: e.target.value })} /></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-sm outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-sm primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupTrips;
