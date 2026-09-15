import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const CATEGORIES = ['beach', 'mountain', 'city', 'cultural', 'adventure', 'luxury', 'wildlife'];

const ManageDestinations = () => {
  const [dests, setDests]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast]         = useState('');
  const [form, setForm] = useState({ name: '', country: '', category: 'beach', description: '', bestTime: '', avgCost: '', rating: 4.5, emoji: '🌍' });

  const fetchDests = () => {
    api.get('/admin/destinations').then((r) => setDests(r.data.destinations || [])).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchDests(); }, []);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/destinations', form);
      setShowModal(false);
      setForm({ name: '', country: '', category: 'beach', description: '', bestTime: '', avgCost: '', rating: 4.5, emoji: '🌍' });
      fetchDests();
      showToast('Destination added!');
    } catch (err) { showToast(err.response?.data?.message || 'Error.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this destination?')) return;
    try { await api.delete(`/admin/destinations/${id}`); fetchDests(); showToast('Deleted.'); }
    catch { showToast('Error.'); }
  };

  const handleToggle = async (id, current) => {
    try { await api.put(`/admin/destinations/${id}`, { isActive: !current }); fetchDests(); showToast('Updated!'); }
    catch { showToast('Error.'); }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div>
      {toast && <div className="toast">{toast}</div>}
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <span className="section-title">Destinations ({dests.length})</span>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Destination</button>
      </div>

      {dests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌍</div>
          <p>No destinations yet. Add the first one!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1rem' }}>
          {dests.map((d) => (
            <div key={d._id} className="card" style={{ opacity: d.isActive ? 1 : 0.6 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{d.emoji}</div>
              <div style={{ fontWeight: 600 }}>{d.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{d.country}</div>
              <div style={{ margin: '6px 0' }}>
                <span className="badge badge-blue" style={{ textTransform: 'capitalize', fontSize: 9 }}>{d.category}</span>
              </div>
              {d.bestTime && <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>📅 Best: {d.bestTime}</div>}
              <div style={{ fontSize: 12, marginTop: 4 }}>⭐ {d.rating} · 👁 {d.visitCount} visits</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                <button className="btn-sm outline" style={{ flex: 1 }} onClick={() => handleToggle(d._id, d.isActive)}>
                  {d.isActive ? 'Disable' : 'Enable'}
                </button>
                <button className="btn-sm danger" onClick={() => handleDelete(d._id)}>Del</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="modal-title">🌍 Add Destination</div>
            <form onSubmit={handleCreate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group"><label className="form-label">Name</label>
                  <input className="form-input" placeholder="e.g. Goa" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div className="form-group"><label className="form-label">Country</label>
                  <input className="form-input" placeholder="e.g. India" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required /></div>
              </div>
              <div className="form-group"><label className="form-label">Category</label>
                <select className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c}</option>)}
                </select></div>
              <div className="form-group"><label className="form-label">Emoji</label>
                <input className="form-input" placeholder="🌴" value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Description</label>
                <textarea className="form-input" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group"><label className="form-label">Best Time</label>
                  <input className="form-input" placeholder="e.g. Oct–Mar" value={form.bestTime} onChange={(e) => setForm({ ...form, bestTime: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Avg Cost (₹)</label>
                  <input className="form-input" type="number" min="0" value={form.avgCost} onChange={(e) => setForm({ ...form, avgCost: e.target.value })} /></div>
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

export default ManageDestinations;
