import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

// Static sample logs — in production, replace with a real /api/admin/logs endpoint
const SAMPLE_LOGS = [
  { id: 1, time: 'Today, 10:45',  user: 'Admin',   role: 'admin',   action: 'Destination Added',   detail: 'Added Santorini, Greece',           ip: '192.168.1.1'   },
  { id: 2, time: 'Today, 10:32',  user: 'Manager', role: 'manager', action: 'Activity Assigned',   detail: 'Snorkeling to Goa Beach Group',      ip: '192.168.1.2'   },
  { id: 3, time: 'Today, 09:58',  user: 'Traveler',role: 'traveler',action: 'Booking Created',     detail: 'Hotel booking — Goa Beach Resort',   ip: '103.45.67.89'  },
  { id: 4, time: 'Today, 09:30',  user: 'Admin',   role: 'admin',   action: 'User Modified',       detail: 'Updated role for user #1042',        ip: '192.168.1.1'   },
  { id: 5, time: 'Today, 08:15',  user: 'Traveler',role: 'traveler',action: 'Login',               detail: 'Successful login',                   ip: '110.22.33.44'  },
  { id: 6, time: 'Yesterday, 22', user: 'Admin',   role: 'admin',   action: 'Package Created',     detail: 'New package: Maldives Luxury',       ip: '192.168.1.1'   },
  { id: 7, time: 'Yesterday, 21', user: 'Traveler',role: 'traveler',action: 'Trip Updated',        detail: 'Modified Himalayan itinerary',       ip: '98.76.54.32'   },
  { id: 8, time: 'Yesterday, 18', user: 'Manager', role: 'manager', action: 'Group Trip Created',  detail: 'Kerala Backwaters Tour — 18 seats',  ip: '192.168.1.2'   },
  { id: 9, time: 'Yesterday, 15', user: 'Traveler',role: 'traveler',action: 'Signup',              detail: 'New account registered',             ip: '220.11.22.33'  },
  { id:10, time: '2 days ago',    user: 'Admin',   role: 'admin',   action: 'User Deleted',        detail: 'Removed inactive account #0987',     ip: '192.168.1.1'   },
];

const ACTION_COLORS = {
  'Login':             'badge-green',
  'Signup':            'badge-blue',
  'Booking Created':   'badge-blue',
  'Trip Updated':      'badge-gold',
  'Activity Assigned': 'badge-gold',
  'Destination Added': 'badge-blue',
  'Package Created':   'badge-blue',
  'Group Trip Created':'badge-blue',
  'User Modified':     'badge-gold',
  'User Deleted':      'badge-red',
};

const ROLE_COLORS = { admin: '#e17055', manager: '#f0a500', traveler: '#2e86de' };

const ActivityLog = () => {
  const [logs, setLogs]         = useState(SAMPLE_LOGS);
  const [roleFilter, setRole]   = useState('');
  const [search, setSearch]     = useState('');
  const [users, setUsers]       = useState([]);

  useEffect(() => {
    // Fetch real users for context
    api.get('/admin/users').then((r) => setUsers(r.data.users || [])).catch(() => {});
  }, []);

  const filtered = logs.filter((l) => {
    const matchRole   = roleFilter ? l.role === roleFilter : true;
    const matchSearch = search
      ? l.action.toLowerCase().includes(search.toLowerCase()) ||
        l.detail.toLowerCase().includes(search.toLowerCase()) ||
        l.user.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchRole && matchSearch;
  });

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 14px', maxWidth: 340 }}>
          <span>🔍</span>
          <input
            style={{ border: 'none', outline: 'none', flex: 1, fontSize: 14, fontFamily: 'inherit' }}
            placeholder="Search actions, details, users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="form-input" style={{ maxWidth: 160 }} value={roleFilter} onChange={(e) => setRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="traveler">Traveler</option>
        </select>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{filtered.length} events</div>
      </div>

      {/* System Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Users', value: users.length, icon: '👥' },
          { label: 'Events Today', value: SAMPLE_LOGS.filter((l) => l.time.startsWith('Today')).length, icon: '📋' },
          { label: 'Active Admins', value: users.filter((u) => u.role === 'admin').length, icon: '🛡️' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="stat-card blue">
            <div className="stat-icon">{icon}</div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Log table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User</th>
            <th>Action</th>
            <th>Details</th>
            <th>IP Address</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((log) => (
            <tr key={log.id}>
              <td style={{ fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{log.time}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: ROLE_COLORS[log.role] || '#888', color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {log.user[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{log.user}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{log.role}</div>
                  </div>
                </div>
              </td>
              <td>
                <span className={`badge ${ACTION_COLORS[log.action] || 'badge-blue'}`} style={{ fontSize: 10 }}>
                  {log.action}
                </span>
              </td>
              <td style={{ fontSize: 12 }}>{log.detail}</td>
              <td style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{log.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', marginTop: 12 }}>
          No log entries match your filter.
        </div>
      )}

      <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>
        Showing sample log data. Connect a logging middleware (e.g. morgan + winston) for live logs.
      </div>
    </div>
  );
};

export default ActivityLog;
