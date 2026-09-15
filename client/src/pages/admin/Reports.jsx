import React, { useState } from 'react';

const REPORT_TYPES = [
  { emoji: '📊', title: 'Monthly Revenue Report',    desc: 'Total revenue breakdown by month and package type.',     key: 'revenue'      },
  { emoji: '👥', title: 'User Activity Report',       desc: 'Logins, signups and role-wise activity summary.',        key: 'users'        },
  { emoji: '✈️', title: 'Booking Summary',            desc: 'All bookings with status, type and cost breakdown.',     key: 'bookings'     },
  { emoji: '🌍', title: 'Destination Performance',    desc: 'Visit counts, ratings and popularity per destination.',  key: 'destinations' },
  { emoji: '💰', title: 'Financial Summary',          desc: 'Income vs expenses across all trips and packages.',      key: 'financial'    },
  { emoji: '⭐', title: 'Customer Satisfaction',      desc: 'Ratings and feedback analysis from all travelers.',      key: 'satisfaction' },
];

const Reports = () => {
  const [generated, setGenerated] = useState({});
  const [loading, setLoading]     = useState({});
  const [toast, setToast]         = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleGenerate = (key, title) => {
    setLoading((p) => ({ ...p, [key]: true }));
    // Simulate report generation delay
    setTimeout(() => {
      setGenerated((p) => ({ ...p, [key]: new Date().toLocaleString() }));
      setLoading((p) => ({ ...p, [key]: false }));
      showToast(`${title} generated!`);
    }, 1200);
  };

  const handleDownload = (title) => {
    showToast(`Downloading ${title}...`);
  };

  return (
    <div>
      {toast && <div className="toast">{toast}</div>}

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Generate and download system reports. Reports pull live data from the database.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
        {REPORT_TYPES.map((report) => (
          <div key={report.key} className="card">
            <div style={{ fontSize: 32, marginBottom: 10 }}>{report.emoji}</div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{report.title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>{report.desc}</div>

            {generated[report.key] && (
              <div style={{ fontSize: 11, color: 'var(--accent-green)', marginBottom: 10 }}>
                ✓ Generated: {generated[report.key]}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn-sm primary"
                style={{ flex: 1 }}
                disabled={loading[report.key]}
                onClick={() => handleGenerate(report.key, report.title)}
              >
                {loading[report.key] ? 'Generating...' : 'Generate'}
              </button>
              {generated[report.key] && (
                <button className="btn-sm outline" onClick={() => handleDownload(report.title)}>
                  ⬇ CSV
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
