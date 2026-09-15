import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleRedirect = { traveler: '/traveler-dashboard', manager: '/manager-dashboard', admin: '/admin-dashboard' };

const LoginPage = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(roleRedirect[user.role]);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick demo login
  const demoLogin = async (role) => {
    const demos = {
      traveler: { email: 'traveler@demo.com', password: 'demo1234' },
      manager:  { email: 'manager@demo.com',  password: 'demo1234' },
      admin:    { email: 'admin@demo.com',     password: 'demo1234' },
    };
    setEmail(demos[role].email);
    setPassword(demos[role].password);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="emoji">✈️</div>
          <h1>WanderPlan</h1>
          <p>Sign in to your account</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        {/* Demo quick access */}
        <div style={{ marginTop: '1.5rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            Demo Access
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {['traveler', 'manager', 'admin'].map((role) => (
              <button
                key={role}
                onClick={() => demoLogin(role)}
                style={{ padding: '8px 4px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}
              >
                {role === 'traveler' ? '🧳' : role === 'manager' ? '📋' : '🛡️'} {role}
              </button>
            ))}
          </div>
        </div>

        <div className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
