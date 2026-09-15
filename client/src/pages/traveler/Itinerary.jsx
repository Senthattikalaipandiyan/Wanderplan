import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const Itinerary = () => {
  const [trips, setTrips]           = useState([]);
  const [selectedTrip, setSelected] = useState(null);
  const [showModal, setShowModal]   = useState(false);
  const [toast, setToast]           = useState('');
  
  // Updated editable fields
  const [actForm, setActForm] = useState({ day: 1, startTime: '', endTime: '', activity: '', location: '', notes: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editTarget, setEditTarget] = useState({ dayIndex: -1, actIndex: -1 });

  useEffect(() => {
    api.get('/trips').then((r) => {
      const list = r.data.trips || [];
      setTrips(list);
      if (list.length > 0) setSelected(list[0]);
    }).catch(console.error);
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleDownloadPDF = async () => {
    if (!selectedTrip) return;
    try {
      showToast('Generating PDF...');
      const res = await api.get(`/pdf/${selectedTrip._id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Trip_Report_${selectedTrip.destination}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      showToast('Error downloading PDF.');
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setActForm({ day: 1, startTime: '', endTime: '', activity: '', location: '', notes: '' });
    setShowModal(true);
  };

  const openEditModal = (dayIndex, actIndex, act, dayNum) => {
    setIsEditing(true);
    setEditTarget({ dayIndex, actIndex });
    setActForm({
      day: dayNum,
      startTime: act.startTime || '',
      endTime: act.endTime || '',
      activity: act.activity || act.title || '',
      location: act.location || '',
      notes: act.notes || act.description || ''
    });
    setShowModal(true);
  };

  const handleSaveActivity = async (e) => {
    e.preventDefault();
    if (!selectedTrip) return;
    try {
      let itinerary = selectedTrip.itinerary ? [...selectedTrip.itinerary] : [];
      const newAct = {
        title: actForm.activity, // for backward compatibility
        activity: actForm.activity,
        startTime: actForm.startTime,
        endTime: actForm.endTime,
        location: actForm.location,
        notes: actForm.notes,
        lastUpdated: new Date()
      };

      if (isEditing) {
        // Edit existing
        itinerary[editTarget.dayIndex].activities[editTarget.actIndex] = newAct;
      } else {
        // Add new
        const existing = itinerary.find((d) => d.day === Number(actForm.day));
        if (existing) {
          existing.activities = [...(existing.activities || []), newAct];
        } else {
          itinerary.push({ day: Number(actForm.day), activities: [newAct] });
        }
      }

      itinerary.sort((a, b) => a.day - b.day);
      const res = await api.put(`/trips/${selectedTrip._id}`, { itinerary });
      const updated = res.data.trip;
      setSelected(updated);
      setTrips((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      setShowModal(false);
      showToast(isEditing ? 'Activity updated!' : 'Activity added!');
    } catch (err) { showToast('Error saving activity.'); }
  };

  return (
    <div>
      {toast && <div className="toast">{toast}</div>}

      {/* Trip selector */}
      <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <select className="form-input" style={{ maxWidth: 280 }} value={selectedTrip?._id || ''}
          onChange={(e) => setSelected(trips.find((t) => t._id === e.target.value) || null)}>
          {trips.map((t) => <option key={t._id} value={t._id}>{t.destination}, {t.country}</option>)}
        </select>
        {selectedTrip && (
          <>
            <button className="btn btn-primary" onClick={openAddModal}>+ Add Activity</button>
            <button className="btn-sm outline" onClick={handleDownloadPDF}>⬇ Download PDF</button>
          </>
        )}
      </div>

      {!selectedTrip ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
          <p>No trips found. Create a trip first to manage its itinerary.</p>
        </div>
      ) : (
        <div>
          <div className="card" style={{ marginBottom: '1rem', background: 'linear-gradient(135deg,#e8f4fd,#dbeafe)', border: 'none' }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{selectedTrip.destination}, {selectedTrip.country}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              {new Date(selectedTrip.startDate).toLocaleDateString()} – {new Date(selectedTrip.endDate).toLocaleDateString()}
              &nbsp;·&nbsp; Budget: ₹{Number(selectedTrip.budget).toLocaleString('en-IN')}
            </div>
          </div>

          {(!selectedTrip.itinerary || selectedTrip.itinerary.length === 0) ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              No itinerary yet. Click "Add Activity" to start planning your days.
            </div>
          ) : (
            selectedTrip.itinerary.map((day, dIdx) => (
              <div key={day.day} className="card" style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--accent-blue)', marginBottom: 12 }}>
                  Day {day.day} {day.date ? `— ${new Date(day.date).toLocaleDateString()}` : ''}
                </div>
                <div className="timeline">
                  {(day.activities || []).map((act, aIdx) => (
                    <div key={aIdx} className="timeline-item" style={{ position: 'relative' }}>
                      <div className="timeline-dot" style={{ background: 'var(--accent-blue)', fontSize: 11 }}>🎯</div>
                      <div className="timeline-content" style={{ paddingRight: '60px' }}>
                        <div className="timeline-title">
                          {(act.startTime || act.time) && <span style={{ color: 'var(--text-secondary)', marginRight: 8 }}>{act.startTime || act.time} {act.endTime && `- ${act.endTime}`}</span>}
                          {act.activity || act.title}
                        </div>
                        {(act.notes || act.description) && <div className="timeline-sub">{act.notes || act.description}</div>}
                        {act.location && <div className="timeline-sub">📍 {act.location}</div>}
                        {act.lastUpdated && <div className="timeline-sub" style={{ fontSize: 10, color: '#aaa', marginTop: 4 }}>Last Updated: {new Date(act.lastUpdated).toLocaleString()}</div>}
                        
                        <button 
                          onClick={() => openEditModal(dIdx, aIdx, act, day.day)}
                          className="btn-sm outline" 
                          style={{ position: 'absolute', right: 0, top: 0, padding: '2px 8px', fontSize: 12 }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add/Edit Activity Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="modal-title">{isEditing ? '✏️ Edit Activity' : '🎯 Add Activity'}</div>
            <form onSubmit={handleSaveActivity}>
              <div className="form-group">
                <label className="form-label">Day Number</label>
                <input className="form-input" type="number" min="1" value={actForm.day} onChange={(e) => setActForm({ ...actForm, day: e.target.value })} required disabled={isEditing} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input className="form-input" type="time" value={actForm.startTime} onChange={(e) => setActForm({ ...actForm, startTime: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input className="form-input" type="time" value={actForm.endTime} onChange={(e) => setActForm({ ...actForm, endTime: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Activity</label>
                <input className="form-input" placeholder="e.g. Visit Calangute Beach" value={actForm.activity} onChange={(e) => setActForm({ ...actForm, activity: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" placeholder="e.g. Calangute, Goa" value={actForm.location} onChange={(e) => setActForm({ ...actForm, location: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-input" rows={2} placeholder="Important details..." value={actForm.notes} onChange={(e) => setActForm({ ...actForm, notes: e.target.value })} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-sm outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-sm primary">{isEditing ? 'Save Changes' : 'Add Activity'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Itinerary;
