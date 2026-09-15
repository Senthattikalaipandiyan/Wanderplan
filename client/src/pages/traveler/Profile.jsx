import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm]   = useState({ name: user?.name || '', phone: user?.phone || '', nationality: user?.nationality || '', passportNumber: user?.passportNumber || '', emergencyContact: user?.emergencyContact || '' });
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await updateProfile(form); showToast('Profile updated successfully!'); }
    catch { showToast('Error updating profile.'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      {toast && <div className="toast">{toast}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>

        {/* Left: Avatar card */}
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--accent-blue)', color: '#fff', fontSize: 24, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            {initials}
          </div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{user?.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{user?.email}</div>
          <div style={{ marginTop: 8 }}>
            <span className="badge badge-blue" style={{ textTransform: 'capitalize' }}>{user?.role}</span>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', marginTop: 16, paddingTop: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Member since</div>
            <div style={{ fontSize: 13, fontWeight: 500, marginTop: 4 }}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'N/A'}
            </div>
          </div>
        </div>

        {/* Right: Edit form */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: '1.25rem' }}>Edit Profile</div>
          <form onSubmit={handleSave}>
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your full name' },
              { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+91 9876543210' },
              { label: 'Nationality', key: 'nationality', type: 'text', placeholder: 'e.g. Indian' },
              { label: 'Passport Number', key: 'passportNumber', type: 'text', placeholder: 'e.g. A1234567' },
              { label: 'Emergency Contact', key: 'emergencyContact', type: 'text', placeholder: 'Name – Phone number' },
            ].map(({ label, key, type, placeholder }) => (
              <div className="form-group" key={key}>
                <label className="form-label">{label}</label>
                <input className="form-input" type={type} placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Email (cannot change)</label>
              <input className="form-input" type="email" value={user?.email || ''} disabled style={{ background: '#f8f9fb', color: 'var(--text-secondary)' }} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
