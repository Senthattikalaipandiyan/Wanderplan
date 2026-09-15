import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const SharedItinerary = () => {
  const [trips, setTrips]           = useState([]);
  const [selectedTrip, setSelected] = useState(null);
  const [showModal, setShowModal]   = useState(false);
  const [toast, setToast]           = useState('');
  const [form, setForm] = useState({ day: 1, title: '', description: '', assignedTo: 'All Travelers' });

  useEffect(() => {
    api.get('/manager/group-trips').then((r) => {
      const list = r.data.trips || [];
      setTrips(list);
      if (list.length > 0) setSelected(list[0]);
    }).catch(console.error);
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleAddDay = async (e) => {
    e.preventDefault();
    if (!selectedTrip) return;
    try {
      const itinerary = [...(selectedTrip.itinerary || [])];
      const existing  = itinerary.find((d) => d.day === Number(form.day));
      const dayData   = { day: Number(form.day), title: form.title, description: form.description, assignedTo: form.assignedTo };
      if (existing) {
        const idx = itinerary.indexOf(existing);
        itinerary[idx] = { ...existing, ...dayData };
      } else {
        itinerary.push(dayData);
        itinerary.sort((a, b) => a.day - b.day);
      }
      const res = await api.put(`/manager/group-trips/${selectedTrip._id}`, { itinerary });
      const updated = res.data.trip;
      setSelected(updated);
      setTrips((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      setShowModal(false);
      showToast('Itinerary day saved!');
    } catch (err) { showToast('Error saving itinerary.'); }
  };

  return (
    <div>
      {toast && <div className="toast">{toast}</div>}

      <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <select className="form-input" style={{ maxWidth: 300 }} value={selectedTrip?._id || ''}
          onChange={(e) => setSelected(trips.find((t) => t._id === e.target.value) || null)}>
          {trips.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
        </select>
        {selectedTrip && (
          <>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Day</button>
            <button className="btn-sm outline" onClick={() => showToast('Share link copied!')}>📤 Share with Group</button>
          </>
        )}
      </div>

      {!selectedTrip ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          No group trips. Create one first.
        </div>
      ) : (
        <div>
          <div className="card" style={{ marginBottom: '1rem', background: 'linear-gradient(135deg,#fff8e8,#ffe9a0)', border: 'none' }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{selectedTrip.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              {selectedTrip.destination}, {selectedTrip.country} &nbsp;·&nbsp;
              {new Date(selectedTrip.startDate).toLocaleDateString()} – {new Date(selectedTrip.endDate).toLocaleDateString()}
              &nbsp;·&nbsp; 👥 {selectedTrip.travelers?.length || 0} travelers
            </div>
          </div>

          {(!selectedTrip.itinerary || selectedTrip.itinerary.length === 0) ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              No itinerary yet. Add days to build the shared plan.
            </div>
          ) : (
            selectedTrip.itinerary.map((day) => (
              <div key={day.day} className="card" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontWeight: 600, color: 'var(--accent-gold)' }}>Day {day.day}</div>
                  <span className="badge badge-blue">{day.assignedTo || 'All Travelers'}</span>
                </div>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>{day.title}</div>
                {day.description && <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{day.description}</div>}
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="modal-title">📋 Add Itinerary Day</div>
            <form onSubmit={handleAddDay}>
              <div className="form-group"><label className="form-label">Day Number</label>
                <input className="form-input" type="number" min="1" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} required /></div>
              <div className="form-group"><label className="form-label">Day Title</label>
                <input className="form-input" placeholder="e.g. Houseboat Tour Day" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="form-group"><label className="form-label">Description</label>
                <textarea className="form-input" rows={3} placeholder="What happens this day..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Assigned To</label>
                <input className="form-input" placeholder="All Travelers / Group A" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} /></div>
              <div className="modal-footer">
                <button type="button" className="btn-sm outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-sm primary">Save Day</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedItinerary;
