import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const EMOJIS = ['🌴', '🗼', '🏔️', '🌊', '🏯', '🌅', '🕌', '🏝️', '🗻', '🌉'];

const MyTrips = () => {
  const [trips, setTrips]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [toast, setToast]       = useState('');
  const [form, setForm] = useState({
    destination: '', country: '', startDate: '', endDate: '',
    budget: '', notes: '', coverEmoji: '✈️',
  });

  const fetchTrips = () => {
    api.get('/trips').then((r) => setTrips(r.data.trips || [])).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchTrips(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleDownloadPDF = async (trip) => {
    try {
      showToast('Generating PDF...');
      const res = await api.get(`/pdf/${trip._id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Trip_Report_${trip.destination}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      showToast('Error downloading PDF.');
    }
  };

  const handleViewSuggestions = async (tripId) => {
    try {
      const res = await api.get(`/suggestions/${tripId}`);
      setSuggestions(res.data.suggestions || []);
      setShowSuggestionsModal(tripId);
    } catch (err) {
      showToast('Error loading suggestions.');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/trips', form);
      setShowModal(false);
      setForm({ destination: '', country: '', startDate: '', endDate: '', budget: '', notes: '', coverEmoji: '✈️' });
      fetchTrips();
      showToast('Trip created successfully!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error creating trip');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trip?')) return;
    try {
      await api.delete(`/trips/${id}`);
      fetchTrips();
      showToast('Trip deleted.');
    } catch (err) { showToast('Error deleting trip.'); }
  };

  const statusBadge = { 'Pending Approval': 'badge-gold', 'Approved': 'badge-green', planning: 'badge-gold', upcoming: 'badge-blue', ongoing: 'badge-green', completed: 'badge-gray' };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div>
      {toast && <div className="toast">{toast}</div>}

      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <span className="section-title">My Trips ({trips.length})</span>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Trip</button>
      </div>

      {trips.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🗺️</div>
          <p>No trips yet. Create your first one!</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowModal(true)}>Plan a Trip</button>
        </div>
      ) : (
        <div className="cards-grid">
          {trips.map((trip) => (
            <div key={trip._id} className="card" style={{ position: 'relative' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{trip.coverEmoji || '✈️'}</div>
              <div style={{ fontWeight: 500, fontSize: 15 }}>{trip.destination}, {trip.country}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '6px 0' }}>
                📅 {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}
              </div>
              <div style={{ fontSize: 13, color: 'var(--accent-blue)', fontWeight: 500, marginBottom: 10 }}>
                Budget: ₹{Number(trip.budget).toLocaleString('en-IN')}
              </div>
              <span className={`badge ${statusBadge[trip.status] || 'badge-gray'}`}>{trip.status}</span>
              {trip.notes && (
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8, borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                  {trip.notes}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="btn-sm outline" style={{ flex: 1 }} onClick={() => handleDownloadPDF(trip)}>⬇ PDF</button>
                <button className="btn-sm outline" style={{ flex: 1 }} onClick={() => handleViewSuggestions(trip._id)}>💬 Suggestions</button>
                <button className="btn-sm danger" onClick={() => handleDelete(trip._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Trip Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="modal-title">✈️ Create New Trip</div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Destination</label>
                <input className="form-input" placeholder="e.g. Goa" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input className="form-input" placeholder="e.g. India" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input className="form-input" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input className="form-input" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Budget (₹)</label>
                <input className="form-input" type="number" placeholder="e.g. 15000" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Cover Emoji</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {EMOJIS.map((em) => (
                    <div key={em} onClick={() => setForm({ ...form, coverEmoji: em })}
                      style={{ fontSize: 24, cursor: 'pointer', padding: 6, borderRadius: 8, border: `2px solid ${form.coverEmoji === em ? 'var(--accent-blue)' : 'var(--border)'}`, background: form.coverEmoji === em ? '#e8f4fd' : '#fff' }}>
                      {em}
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-input" rows={2} placeholder="Any special requirements..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-sm outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-sm primary">Create Trip</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Suggestions Modal */}
      {showSuggestionsModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowSuggestionsModal(null)}>
          <div className="modal-box" style={{ maxWidth: 500 }}>
            <div className="modal-title">💬 Manager Suggestions</div>
            <div style={{ maxHeight: '60vh', overflowY: 'auto', marginBottom: '1rem' }}>
              {suggestions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No suggestions yet.</div>
              ) : (
                suggestions.map(s => (
                  <div key={s._id} style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', marginBottom: '8px' }}>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      {new Date(s.createdAt).toLocaleString()}
                    </div>
                    <div style={{ fontSize: 14 }}>{s.message}</div>
                  </div>
                ))
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-sm outline" onClick={() => setShowSuggestionsModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTrips;
