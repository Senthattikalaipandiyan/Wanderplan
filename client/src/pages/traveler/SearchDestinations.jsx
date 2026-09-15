import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ALL_DESTINATIONS = [
  { emoji: '🌴', name: 'Goa', country: 'India', category: 'beach', price: '₹15,000', rating: 4.8, desc: 'Beaches, nightlife and Portuguese heritage.' },
  { emoji: '🗼', name: 'Paris', country: 'France', category: 'city', price: '₹1,10,000', rating: 4.9, desc: 'City of love, art and the Eiffel Tower.' },
  { emoji: '🏔️', name: 'Manali', country: 'India', category: 'mountain', price: '₹25,000', rating: 4.7, desc: 'Snow-capped peaks and adventure sports.' },
  { emoji: '🌊', name: 'Maldives', country: 'Maldives', category: 'beach', price: '₹2,50,000', rating: 4.9, desc: 'Crystal waters and overwater bungalows.' },
  { emoji: '🏯', name: 'Kyoto', country: 'Japan', category: 'cultural', price: '₹95,000', rating: 4.9, desc: 'Ancient temples and cherry blossoms.' },
  { emoji: '🌅', name: 'Santorini', country: 'Greece', category: 'beach', price: '₹1,20,000', rating: 4.8, desc: 'Iconic white-blue buildings and sunsets.' },
  { emoji: '🕌', name: 'Dubai', country: 'UAE', category: 'city', price: '₹80,000', rating: 4.6, desc: 'Luxury shopping, skyscrapers and desert.' },
  { emoji: '🌿', name: 'Kerala', country: 'India', category: 'cultural', price: '₹28,000', rating: 4.8, desc: 'Backwaters, Ayurveda and lush greenery.' },
  { emoji: '🏛️', name: 'Rome', country: 'Italy', category: 'cultural', price: '₹1,00,000', rating: 4.8, desc: 'Colosseum, Vatican and ancient history.' },
  { emoji: '🌉', name: 'New York', country: 'USA', category: 'city', price: '₹1,80,000', rating: 4.7, desc: 'Times Square, Central Park, Broadway.' },
  { emoji: '🏝️', name: 'Andaman', country: 'India', category: 'beach', price: '₹35,000', rating: 4.8, desc: 'Pristine beaches and coral reefs.' },
  { emoji: '🗻', name: 'Nepal', country: 'Nepal', category: 'mountain', price: '₹40,000', rating: 4.7, desc: 'Himalayan trekking and monasteries.' },
];

const CATEGORIES = ['all', 'beach', 'mountain', 'city', 'cultural'];

const SearchDestinations = () => {
  const [query, setQuery]     = useState('');
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const filtered = ALL_DESTINATIONS.filter((d) => {
    const matchCat = category === 'all' || d.category === category;
    const matchQ   = d.name.toLowerCase().includes(query.toLowerCase()) || d.country.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div>
      {/* Search bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', minWidth: 200 }}>
          <span>🔍</span>
          <input style={{ border: 'none', outline: 'none', flex: 1, fontSize: 14, fontFamily: 'inherit' }}
            placeholder="Search destinations or countries..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)}
            style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500, textTransform: 'capitalize', border: `1px solid ${category === cat ? 'var(--accent-blue)' : 'var(--border)'}`, background: category === cat ? 'var(--accent-blue)' : '#fff', color: category === cat ? '#fff' : 'var(--text-secondary)', transition: 'all 0.15s' }}>
            {cat === 'all' ? '🌍 All' : cat === 'beach' ? '🏖️ Beach' : cat === 'mountain' ? '🏔️ Mountain' : cat === 'city' ? '🏙️ City' : '🏛️ Cultural'}
          </button>
        ))}
      </div>

      {/* Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {filtered.map((dest) => (
          <div key={dest.name} className="card" style={{ cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            onClick={() => setSelected(dest)}>
            <div style={{ fontSize: 38, marginBottom: 8 }}>{dest.emoji}</div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{dest.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{dest.country}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '6px 0', lineHeight: 1.5 }}>{dest.desc}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-blue)' }}>{dest.price}</span>
              <span style={{ fontSize: 12 }}>⭐ {dest.rating}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          No destinations found for "{query}"
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: 56 }}>{selected.emoji}</div>
              <div style={{ fontSize: 22, fontWeight: 700, marginTop: 8 }}>{selected.name}, {selected.country}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{selected.desc}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '1rem' }}>
              {[['💰 Avg Cost', selected.price], ['⭐ Rating', selected.rating], ['🏷️ Category', selected.category], ['🌍 Country', selected.country]].map(([l, v]) => (
                <div key={l} className="card" style={{ padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{l}</div>
                  <div style={{ fontWeight: 600, marginTop: 4, textTransform: 'capitalize' }}>{v}</div>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn-sm outline" onClick={() => setSelected(null)}>Close</button>
              <button className="btn-sm primary" onClick={() => { setSelected(null); navigate('/traveler-dashboard/trips'); }}>Plan Trip Here</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDestinations;
