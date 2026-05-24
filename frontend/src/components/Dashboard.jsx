import React from 'react';
import ItemTable from './ItemTable';
import { Download, RefreshCw } from 'lucide-react';
import { apiClient } from '../api/client';

const Dashboard = ({ summary, items, jobId, onReset }) => {
  const formatCurrency = (val) => {
    return '₹' + Math.abs(val).toFixed(2);
  };

  const handleExport = () => {
    window.open(`${apiClient.defaults.baseURL}/api/report/${jobId}`, '_blank');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Analysis Dashboard</h2>
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
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Spent</h3>
          <div style={{ fontSize: '2rem', fontWeight: '700' }}>{formatCurrency(summary.total_spent)}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Earned</h3>
          <div style={{ fontSize: '2rem', fontWeight: '700' }}>{formatCurrency(summary.total_earned)}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Overall P/L</h3>
          <div style={{ 
            fontSize: '2rem', fontWeight: '700', 
            color: summary.overall_pl > 0 ? 'var(--success-color)' : (summary.overall_pl < 0 ? 'var(--danger-color)' : 'var(--text-primary)') 
          }}>
            {summary.overall_pl > 0 ? '+' : (summary.overall_pl < 0 ? '-' : '')}{formatCurrency(summary.overall_pl)}
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Transactions</h3>
          <div style={{ fontSize: '2rem', fontWeight: '700' }}>{summary.total_transactions}</div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <ItemTable items={items} />
      </div>
    </div>
  );
};

export default Dashboard;
