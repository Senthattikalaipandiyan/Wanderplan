import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleRedirect = { traveler: '/traveler-dashboard', manager: '/manager-dashboard', admin: '/admin-dashboard' };

const SignupPage = () => {
  const [form, setForm]       = useState({ name: '', email: '', password: '', role: 'traveler' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate   = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const user = await signup(form.name, form.email, form.password, form.role);
      navigate(roleRedirect[user.role]);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="emoji">✈️</div>
          <h1>WanderPlan</h1>
          <p>Create your account</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input className="auth-input" type="text"     name="name"     placeholder="Full Name"       value={form.name}     onChange={handleChange} required />
          <input className="auth-input" type="email"    name="email"    placeholder="Email address"   value={form.email}    onChange={handleChange} required />
          <input className="auth-input" type="password" name="password" placeholder="Password (min 6)" value={form.password} onChange={handleChange} required />
          <select className="auth-input" name="role" value={form.role} onChange={handleChange}>
            <option value="traveler">🧳 Traveler</option>
            <option value="manager">📋 Travel Manager</option>
            <option value="admin">🛡️ Admin</option>
          </select>
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
