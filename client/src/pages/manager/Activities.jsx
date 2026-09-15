import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const STATUS_BADGE = { pending: 'badge-gold', confirmed: 'badge-blue', completed: 'badge-green', cancelled: 'badge-gray' };

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [trips, setTrips]           = useState([]);
  const [showModal, setShowModal]   = useState(false);
  const [toast, setToast]           = useState('');
  const [form, setForm] = useState({ title: '', groupTrip: '', dateTime: '', location: '', duration: '', assignedTo: 'All Travelers', cost: '' });

  const fetchData = () => {
    api.get('/manager/activities').then((r) => setActivities(r.data.activities || [])).catch(console.error);
    api.get('/manager/group-trips').then((r) => setTrips(r.data.trips || [])).catch(console.error);
  };

  useEffect(() => { fetchData(); }, []);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/manager/activities', form);
      setShowModal(false);
      setForm({ title: '', groupTrip: '', dateTime: '', location: '', duration: '', assignedTo: 'All Travelers', cost: '' });
      fetchData();
      showToast('Activity assigned!');
    } catch (err) { showToast(err.response?.data?.message || 'Error.'); }
  };

  return (
    <div>
      {toast && <div className="toast">{toast}</div>}
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <span className="section-title">Activities ({activities.length})</span>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Assign Activity</button>
      </div>

      {activities.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
          <p>No activities assigned yet.</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr><th>Activity</th><th>Group Trip</th><th>Date & Time</th><th>Assigned To</th><th>Location</th><th>Status</th></tr>
          </thead>
          <tbody>
            {activities.map((act) => (
              <tr key={act._id}>
                <td style={{ fontWeight: 500 }}>🎯 {act.title}</td>
                <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{act.groupTrip?.name || '—'}</td>
                <td style={{ fontSize: 12 }}>{new Date(act.dateTime).toLocaleString()}</td>
                <td style={{ fontSize: 12 }}>{act.assignedTo}</td>
                <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{act.location || '—'}</td>
                <td><span className={`badge ${STATUS_BADGE[act.status]}`}>{act.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="modal-title">🎯 Assign Activity</div>
            <form onSubmit={handleCreate}>
              <div className="form-group"><label className="form-label">Activity Title</label>
                <input className="form-input" placeholder="e.g. Boat Tour" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="form-group"><label className="form-label">Group Trip</label>
                <select className="form-input" value={form.groupTrip} onChange={(e) => setForm({ ...form, groupTrip: e.target.value })} required>
                  <option value="">— Select Group Trip —</option>
                  {trips.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select></div>
              <div className="form-group"><label className="form-label">Date & Time</label>
                <input className="form-input" type="datetime-local" value={form.dateTime} onChange={(e) => setForm({ ...form, dateTime: e.target.value })} required /></div>
              <div className="form-group"><label className="form-label">Location</label>
                <input className="form-input" placeholder="e.g. Cochin Harbour" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group"><label className="form-label">Duration</label>
                  <input className="form-input" placeholder="e.g. 3 hours" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Cost (₹)</label>
                  <input className="form-input" type="number" min="0" placeholder="0" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} /></div>
              </div>
              <div className="form-group"><label className="form-label">Assigned To</label>
                <input className="form-input" placeholder="e.g. All Travelers or Group A" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} /></div>
              <div className="modal-footer">
                <button type="button" className="btn-sm outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-sm primary">Assign</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;
