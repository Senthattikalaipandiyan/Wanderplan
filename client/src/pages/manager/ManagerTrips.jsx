import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const ManagerTrips = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [toast, setToast] = useState('');
  const [showSuggestModal, setShowSuggestModal] = useState(null);
  const [suggestionMsg, setSuggestionMsg] = useState('');

  const fetchTrips = () => {
    api.get('/trips').then(r => setTrips(r.data.trips || [])).catch(console.error);
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleSuggest = async (e) => {
    e.preventDefault();
    try {
      await api.post('/suggestions', { tripId: showSuggestModal, message: suggestionMsg });
      showToast('Suggestion added!');
      setShowSuggestModal(null);
      setSuggestionMsg('');
    } catch(err) {
      showToast('Error adding suggestion.');
    }
  };

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

  return (
    <div>
      {toast && <div className="toast">{toast}</div>}
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <span className="section-title">My Assigned Trips ({trips.length})</span>
      </div>

      <div className="cards-grid">
        {trips.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No assigned trips.</div>
        ) : trips.map(t => (
          <div key={t._id} className="card">
            <div style={{ fontSize: 36, marginBottom: 10 }}>{t.coverEmoji || '✈️'}</div>
            <div style={{ fontWeight: 500, fontSize: 16 }}>{t.destination}, {t.country}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '6px 0' }}>
              Traveler: {t.traveler?.name}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '6px 0' }}>
              📅 {new Date(t.startDate).toLocaleDateString()} - {new Date(t.endDate).toLocaleDateString()}
            </div>
            <span className={`badge ${t.status === 'Approved' ? 'badge-green' : 'badge-gold'}`}>{t.status}</span>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button className="btn-sm outline" style={{ flex: 1 }} onClick={() => navigate('/manager-dashboard/trip-itinerary')}>📅 Itinerary</button>
              <button className="btn-sm outline" style={{ flex: 1 }} onClick={() => navigate('/manager-dashboard/trip-expenses')}>💰 Expenses</button>
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <button className="btn-sm outline" style={{ flex: 1 }} onClick={() => setShowSuggestModal(t._id)}>💡 Suggest</button>
              <button className="btn-sm outline" style={{ flex: 1 }} onClick={() => handleDownloadPDF(t)}>⬇ PDF</button>
            </div>
          </div>
        ))}
      </div>

      {/* Suggestion Modal */}
      {showSuggestModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowSuggestModal(null)}>
          <div className="modal-box">
            <div className="modal-title">💡 Add Suggestion</div>
            <form onSubmit={handleSuggest}>
              <div className="form-group">
                <label className="form-label">Your Suggestion</label>
                <textarea 
                  className="form-input" 
                  rows="4" 
                  placeholder="e.g., You should visit the Taj Mahal early in the morning..."
                  value={suggestionMsg} 
                  onChange={(e) => setSuggestionMsg(e.target.value)} 
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-sm outline" onClick={() => setShowSuggestModal(null)}>Cancel</button>
                <button type="submit" className="btn-sm primary">Submit Suggestion</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerTrips;
