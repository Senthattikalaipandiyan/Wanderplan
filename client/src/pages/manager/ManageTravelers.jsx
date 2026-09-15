import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const COLORS = ['#2e86de', '#00b894', '#f0a500', '#e17055', '#a29bfe'];

const ManageTravelers = () => {
  const [travelers, setTravelers] = useState([]);
  const [trips, setTrips]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ userId: '', tripId: '' });
  const [search, setSearch]       = useState('');

  const fetchData = () => {
    Promise.all([api.get('/manager/travelers'), api.get('/manager/group-trips')])
      .then(([tr, tp]) => { setTravelers(tr.data.travelers || []); setTrips(tp.data.trips || []); })
      .catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/manager/group-trips/${form.tripId}/travelers`, { userId: form.userId });
      setShowModal(false);
      fetchData();
      showToast('Traveler added to trip!');
    } catch (err) { showToast(err.response?.data?.message || 'Error.'); }
  };

  const handleRemove = async (tripId, userId) => {
    if (!window.confirm('Remove this traveler?')) return;
    try {
      await api.delete(`/manager/group-trips/${tripId}/travelers/${userId}`);
      fetchData();
      showToast('Traveler removed.');
    } catch { showToast('Error.'); }
  };

  const filtered = travelers.filter((t) =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div>
      {toast && <div className="toast">{toast}</div>}
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <span className="section-title">Travelers ({travelers.length})</span>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add to Trip</button>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 14px', marginBottom: '1.5rem', maxWidth: 360 }}>
        <span>🔍</span>
        <input style={{ border: 'none', outline: 'none', flex: 1, fontSize: 14, fontFamily: 'inherit' }}
          placeholder="Search travelers..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🧳</div>
          <p>No travelers found.</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr><th>Traveler</th><th>Email</th><th>Group Trip</th><th>Joined</th><th>Action</th></tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => {
              const initials = t.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';
              return (
                <tr key={t._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: COLORS[i % COLORS.length], color: '#fff', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {initials}
                      </div>
                      <span style={{ fontWeight: 500 }}>{t.name}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t.email}</td>
                  <td style={{ fontSize: 12 }}>{t.groupTrip || '—'}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '—'}</td>
                  <td>
                    <button className="btn-sm danger" onClick={() => showToast('Select a trip to remove from.')}>Remove</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="modal-title">🧳 Add Traveler to Group Trip</div>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label className="form-label">Traveler User ID</label>
                <input className="form-input" placeholder="Paste traveler's user ID" value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} required />
                <small style={{ color: 'var(--text-secondary)', fontSize: 11 }}>Ask admin for the user ID, or implement user search.</small>
              </div>
              <div className="form-group">
                <label className="form-label">Group Trip</label>
                <select className="form-input" value={form.tripId} onChange={(e) => setForm({ ...form, tripId: e.target.value })} required>
                  <option value="">— Select Group Trip —</option>
                  {trips.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-sm outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-sm primary">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTravelers;
