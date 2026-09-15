import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const ManageTrips = () => {
  const [trips, setTrips] = useState([]);
  const [managers, setManagers] = useState([]);
  const [toast, setToast] = useState('');

  const fetchTrips = () => {
    api.get('/trips').then(r => setTrips(r.data.trips || [])).catch(console.error);
  };

  const fetchManagers = () => {
    api.get('/admin/users').then(r => {
      const allUsers = r.data.users || [];
      setManagers(allUsers.filter(u => u.role === 'manager'));
    }).catch(console.error);
  };

  useEffect(() => {
    fetchTrips();
    fetchManagers();
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleApprove = async (id) => {
    try {
      await api.put(`/trips/${id}/approve`);
      fetchTrips();
      showToast('Trip Approved!');
    } catch(err) { showToast('Error approving trip.'); }
  };

  const handleAssignManager = async (tripId, managerId) => {
    if (!managerId) return;
    try {
      await api.put(`/trips/${tripId}/assign-manager`, { managerId });
      fetchTrips();
      showToast('Manager Assigned!');
    } catch(err) { showToast('Error assigning manager.'); }
  };

  const pendingTrips = trips.filter(t => t.status === 'Pending Approval');
  const otherTrips = trips.filter(t => t.status !== 'Pending Approval');

  const renderTable = (tripList, isPending) => (
    <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '2rem' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>Trip</th><th>Traveler</th><th>Dates</th><th>Manager</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tripList.length === 0 ? (
            <tr><td colSpan="6" style={{ textAlign:'center', color:'#888', padding:'1rem' }}>No trips found.</td></tr>
          ) : tripList.map(t => (
            <tr key={t._id}>
              <td style={{ fontWeight: 500 }}>{t.destination}, {t.country}</td>
              <td>{t.traveler?.name || 'Unknown'}</td>
              <td>{new Date(t.startDate).toLocaleDateString()}</td>
              <td>
                <select 
                  className="form-input" 
                  style={{ padding: '4px', height: 'auto', minWidth: 120 }}
                  value={t.managerId?._id || t.managerId || ''}
                  onChange={(e) => handleAssignManager(t._id, e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {managers.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>
              </td>
              <td><span className={`badge ${t.status === 'Approved' ? 'badge-green' : 'badge-gold'}`}>{t.status}</span></td>
              <td>
                {isPending && <button className="btn-sm primary" onClick={() => handleApprove(t._id)}>Approve</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      {toast && <div className="toast">{toast}</div>}
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <span className="section-title">Trip Workflow Management</span>
      </div>

      <div className="section-title" style={{ marginBottom: 10 }}>Pending Approval ({pendingTrips.length})</div>
      {renderTable(pendingTrips, true)}

      <div className="section-title" style={{ marginBottom: 10 }}>All Other Trips</div>
      {renderTable(otherTrips, false)}
    </div>
  );
};

export default ManageTrips;
