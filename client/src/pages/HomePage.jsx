import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      const map = { traveler: '/traveler-dashboard', manager: '/manager-dashboard', admin: '/admin-dashboard' };
      navigate(map[user.role]);
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div style={{ fontSize: 56, marginBottom: 16 }}>✈️</div>
        <h1>WanderPlan</h1>
        <p>Plan trips, manage groups, and explore the world — all in one place.</p>
        <div className="hero-btns">
          <button className="hero-btn primary" onClick={handleGetStarted}>Get Started Free</button>
          <button className="hero-btn outline" onClick={() => navigate('/login')}>Login</button>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <h2>Everything you need to travel smarter</h2>
        <div className="features-grid">
          {[
            { emoji: '🧳', title: 'For Travelers', desc: 'Plan trips, build itineraries, track expenses, and manage bookings in one dashboard.' },
            { emoji: '📋', title: 'For Managers', desc: 'Create group trips, assign activities, and track progress for all your travelers.' },
            { emoji: '🛡️', title: 'For Admins', desc: 'Full control over users, destinations, packages, bookings, and system analytics.' },
            { emoji: '🔒', title: 'Role-Based Access', desc: 'Secure JWT authentication ensures each user only sees what they are allowed to.' },
            { emoji: '💰', title: 'Expense Tracking', desc: 'Stay on budget with category-wise expense tracking and visual reports.' },
            { emoji: '📊', title: 'Analytics', desc: 'Get insights into travel trends, booking patterns, and revenue data.' },
          ].map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-emoji">{f.emoji}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '2rem', color: '#888', fontSize: 13, borderTop: '1px solid #e0e6ef' }}>
        WanderPlan &copy; 2024 — OOSE Mini Project | MERN Stack
      </footer>
    </div>
  );
};

export default HomePage;
