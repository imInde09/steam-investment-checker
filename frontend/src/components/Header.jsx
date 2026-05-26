import React from 'react';
import { Activity, Download, RefreshCw } from 'lucide-react';
import { apiClient } from '../api/client';

const Header = ({ jobId, onReset }) => {
  const handleExport = () => {
    window.open(`${apiClient.defaults.baseURL}/api/report/${jobId}`, '_blank');
  };

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem 2rem', 
      background: 'rgba(30, 41, 59, 0.9)', 
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)', 
      position: 'sticky', 
      top: 0, 
      zIndex: 50 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Activity size={28} color="#8b5cf6" />
        <h1 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '700', 
          margin: 0, 
          background: 'linear-gradient(to right, #60a5fa, #a78bfa)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent' 
        }}>
          Steam Inventory Analyzer
        </h1>
      </div>
      
      {jobId && (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={handleExport}
            style={{
              backgroundColor: 'var(--accent-color)', color: 'white', border: 'none', padding: '0.5rem 1rem',
              borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500'
            }}
          >
            <Download size={18} /> Export HTML
          </button>
          <button 
            onClick={onReset}
            style={{
              backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', 
              padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500'
            }}
          >
            <RefreshCw size={18} /> New File
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
