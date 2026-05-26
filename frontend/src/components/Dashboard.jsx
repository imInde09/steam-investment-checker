import React, { useState, useEffect } from 'react';
import ItemTable from './ItemTable';
import { Download, RefreshCw, Loader } from 'lucide-react';
import { apiClient } from '../api/client';

const Dashboard = ({ jobId, onReset }) => {
  const [summary, setSummary] = useState(null);
  const [items, setItems] = useState([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('pending');
  const [stats, setStats] = useState({ fetched: 0, total: 0 });

  useEffect(() => {
    if (!jobId) return;

    let eventSource;
    try {
      const url = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/stream/${jobId}`;
      eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setProgress(data.progress);
        setStatus(data.status);
        setStats({ fetched: data.fetched_items, total: data.total_items });

        if (data.results) {
          setSummary(data.results.summary);
          setItems(data.results.items);
        }

        if (data.status === 'completed' || data.status === 'error') {
          eventSource.close();
        }
      };

      eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
        eventSource.close();
      };
    } catch (err) {
      console.error("Failed to connect to stream", err);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [jobId]);

  const formatCurrency = (val) => {
    return '₹' + Math.abs(val).toFixed(2);
  };

  return (
    <div>
      {status !== 'completed' && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Loader size={24} color="var(--accent-color)" className="animate-spin" />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ fontWeight: '500' }}>Fetching Live Market Prices...</span>
              <span style={{ color: 'var(--text-secondary)' }}>{stats.fetched} / {stats.total} items ({Math.round(progress)}%)</span>
            </div>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${progress}%`, 
                backgroundColor: 'var(--accent-color)', 
                height: '100%', 
                transition: 'width 0.5s ease-out' 
              }}></div>
            </div>
          </div>
          <style>{`
            @keyframes spin { 100% { transform: rotate(360deg); } }
            .animate-spin { animation: spin 1s linear infinite; }
          `}</style>
        </div>
      )}

      {summary && items.length > 0 ? (
        <>
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
        </>
      ) : (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Processing your inventory data...
        </div>
      )}
    </div>
  );
};

export default Dashboard;
