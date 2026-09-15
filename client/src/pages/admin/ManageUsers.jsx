import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const COLORS = ['#2e86de', '#00b894', '#f0a500', '#e17055', '#a29bfe'];

const ManageUsers = () => {
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast]         = useState('');
  const [search, setSearch]       = useState('');
  const [roleFilter, setRole]     = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'traveler' });

  const fetchUsers = () => {
    const params = new URLSearchParams();
    if (roleFilter) params.set('role', roleFilter);
    if (search)     params.set('search', search);
    api.get(`/admin/users?${params}`).then((r) => setUsers(r.data.users || [])).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [roleFilter, search]);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', form);
      setShowModal(false);
      setForm({ name: '', email: '', password: '', role: 'traveler' });
      fetchUsers();
      showToast('User created!');
    } catch (err) { showToast(err.response?.data?.message || 'Error.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try { await api.delete(`/admin/users/${id}`); fetchUsers(); showToast('User deleted.'); }
    catch { showToast('Error.'); }
  };

  const handleToggleActive = async (id, current) => {
    try { await api.put(`/admin/users/${id}`, { isActive: !current }); fetchUsers(); showToast('Status updated!'); }
    catch { showToast('Error.'); }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div>
      {toast && <div className="toast">{toast}</div>}

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add User</button>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 14px', maxWidth: 320 }}>
          <span>🔍</span>
          <input style={{ border: 'none', outline: 'none', flex: 1, fontSize: 14, fontFamily: 'inherit' }}
            placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-input" style={{ maxWidth: 160 }} value={roleFilter} onChange={(e) => setRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="traveler">Traveler</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--text-secondary)' }}>{users.length} users found</div>

      <table className="data-table">
        <thead>
          <tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map((u, i) => {
            const initials = u.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';
            return (
              <tr key={u._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: COLORS[i % COLORS.length], color: '#fff', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {initials}
                    </div>
                    <span style={{ fontWeight: 500 }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{u.email}</td>
                <td><span className={`badge badge-${u.role === 'admin' ? 'red' : u.role === 'manager' ? 'gold' : 'blue'}`} style={{ textTransform: 'capitalize' }}>{u.role}</span></td>
                <td><span className={`badge badge-${u.isActive ? 'green' : 'gray'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-sm outline" onClick={() => handleToggleActive(u._id, u.isActive)}>
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="btn-sm danger" onClick={() => handleDelete(u._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="modal-title">👤 Add New User</div>
            <form onSubmit={handleCreate}>
              <div className="form-group"><label className="form-label">Full Name</label>
                <input className="form-input" placeholder="User's full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="form-group"><label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="user@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
              <div className="form-group"><label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="Min 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
              <div className="form-group"><label className="form-label">Role</label>
                <select className="form-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="traveler">Traveler</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select></div>
              <div className="modal-footer">
                <button type="button" className="btn-sm outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-sm primary">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
