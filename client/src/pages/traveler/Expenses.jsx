import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const CATEGORIES = ['accommodation', 'transport', 'food', 'activity', 'shopping', 'other'];
const CAT_COLORS = { accommodation: '#2e86de', transport: '#f0a500', food: '#00b894', activity: '#e17055', shopping: '#a29bfe', other: '#888' };
const CAT_EMOJI  = { accommodation: '🏨', transport: '🚗', food: '🍽️', activity: '🎯', shopping: '🛍️', other: '📌' };

const Expenses = () => {
  const [expenses, setExpenses]   = useState([]);
  const [trips, setTrips]         = useState([]);
  const [selectedTrip, setTrip]   = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast]         = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId]       = useState(null);
  const [form, setForm] = useState({ description: '', amount: '', category: 'food', date: '', trip: '' });

  const fetchData = () => {
    api.get('/trips').then((r) => {
      const list = r.data.trips || [];
      setTrips(list);
      if (list.length && !selectedTrip) setTrip(list[0]._id);
    }).catch(console.error);

    if (selectedTrip) {
      api.get(`/expenses?trip=${selectedTrip}`).then((r) => setExpenses(r.data.expenses || [])).catch(console.error);
    } else {
      api.get('/expenses').then((r) => setExpenses(r.data.expenses || [])).catch(console.error);
    }
  };

  useEffect(() => { fetchData(); }, [selectedTrip]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const openAddModal = () => {
    setIsEditing(false);
    setEditId(null);
    setForm({ description: '', amount: '', category: 'food', date: '', trip: selectedTrip });
    setShowModal(true);
  };

  const openEditModal = (exp) => {
    setIsEditing(true);
    setEditId(exp._id);
    setForm({ 
      description: exp.description, 
      amount: exp.amount, 
      category: exp.category, 
      date: exp.date ? new Date(exp.date).toISOString().split('T')[0] : '', 
      trip: exp.trip 
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/expenses/${editId}`, { ...form, trip: form.trip || selectedTrip });
        showToast('Expense updated!');
      } else {
        await api.post('/expenses', { ...form, trip: form.trip || selectedTrip });
        showToast('Expense added!');
      }
      setShowModal(false);
      fetchData();
    } catch (err) { showToast('Error saving expense.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try { await api.delete(`/expenses/${id}`); fetchData(); showToast('Expense deleted.'); }
    catch { showToast('Error deleting expense.'); }
  };

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const byCategory = CATEGORIES.map((cat) => ({
    cat, total: expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter((c) => c.total > 0);

  const currentTripObj = trips.find(t => t._id === selectedTrip);
  const totalBudget = currentTripObj ? currentTripObj.budget : 0;
  const remaining = totalBudget - totalSpent;

  return (
    <div>
      {toast && <div className="toast">{toast}</div>}

      {/* Header */}
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <span className="section-title">Expense Tracker</span>
        <button className="btn btn-primary" onClick={openAddModal}>+ Add Expense</button>
      </div>

      {/* Trip Filter */}
      <select className="form-input" style={{ maxWidth: 260, marginBottom: '1.5rem' }}
        value={selectedTrip} onChange={(e) => setTrip(e.target.value)}>
        <option value="">All Trips</option>
        {trips.map((t) => <option key={t._id} value={t._id}>{t.destination}, {t.country}</option>)}
      </select>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card green">
          <div className="stat-icon">💰</div>
          <div className="stat-value">₹{totalBudget.toLocaleString('en-IN')}</div>
          <div className="stat-label">Total Budget</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon">💸</div>
          <div className="stat-value">₹{totalSpent.toLocaleString('en-IN')}</div>
          <div className="stat-label">Total Spent</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">📈</div>
          <div className="stat-value">₹{remaining.toLocaleString('en-IN')}</div>
          <div className="stat-label">Remaining Budget</div>
        </div>
      </div>

      {/* Category Breakdown */}
      {byCategory.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem', marginTop: '1.5rem' }}>
          <div className="section-title" style={{ marginBottom: 14 }}>By Category</div>
          {byCategory.map(({ cat, total }) => (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 18, width: 24 }}>{CAT_EMOJI[cat]}</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', width: 100, textTransform: 'capitalize' }}>{cat}</span>
              <div style={{ flex: 1, height: 7, background: '#eee', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(total / (totalSpent || 1)) * 100}%`, background: CAT_COLORS[cat], borderRadius: 4 }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, minWidth: 70, textAlign: 'right' }}>₹{total.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      )}

      {/* Transactions Table */}
      <div className="section-title" style={{ marginBottom: 10, marginTop: '1.5rem' }}>Recent Transactions</div>
      {expenses.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No expenses recorded yet.</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp._id}>
                  <td>{new Date(exp.date).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 500 }}>{exp.description}</td>
                  <td>
                    <span className="badge badge-blue" style={{ background: CAT_COLORS[exp.category] + '22', color: CAT_COLORS[exp.category] }}>
                      {CAT_EMOJI[exp.category]} {exp.category}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>₹{exp.amount.toLocaleString('en-IN')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-sm outline" onClick={() => openEditModal(exp)}>Edit</button>
                      <button className="btn-sm danger" onClick={() => handleDelete(exp._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Expense Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="modal-title">{isEditing ? '✏️ Edit Expense' : '💰 Add Expense'}</div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Trip</label>
                <select className="form-input" value={form.trip || selectedTrip} onChange={(e) => setForm({ ...form, trip: e.target.value })} required disabled={isEditing}>
                  {trips.map((t) => <option key={t._id} value={t._id}>{t.destination}, {t.country}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input className="form-input" placeholder="e.g. Hotel Booking" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input className="form-input" type="number" min="0" placeholder="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{CAT_EMOJI[c]} {c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-sm outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-sm primary">{isEditing ? 'Save Changes' : 'Add Expense'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
