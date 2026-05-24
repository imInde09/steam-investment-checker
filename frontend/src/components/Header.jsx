import React from 'react';
import { Activity } from 'lucide-react';

const Header = () => (
  <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
    <h1 style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: '0.5rem',
      fontSize: '2.5rem',
      fontWeight: '700',
      background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '0.5rem'
    }}>
      <Activity size={36} color="#8b5cf6" />
      Steam Loss Visualizer
    </h1>
    <p style={{ color: 'var(--text-secondary)' }}>
      Profit and Loss visualizer for your Steam Inventory
    </p>
  </header>
);

export default Header;
