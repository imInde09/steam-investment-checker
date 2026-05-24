import React, { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { apiClient } from '../api/client';

const ProgressTracker = ({ jobId, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('pending');
  const [stats, setStats] = useState({ fetched: 0, total: 0 });

  useEffect(() => {
    let interval;
    
    const checkStatus = async () => {
      try {
        const response = await apiClient.get(`/api/status/${jobId}`);
        const data = response.data;
        
        setProgress(data.progress);
        setStatus(data.status);
        setStats({ fetched: data.fetched_items, total: data.total_items });
        
        if (data.status === 'completed') {
          clearInterval(interval);
          fetchResults();
        } else if (data.status === 'error') {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Status check failed", err);
      }
    };
    
    const fetchResults = async () => {
      try {
        const response = await apiClient.get(`/api/results/${jobId}`);
        onComplete(response.data);
      } catch (err) {
        console.error("Failed to fetch results", err);
      }
    };

    interval = setInterval(checkStatus, 2000);
    checkStatus();
    
    return () => clearInterval(interval);
  }, [jobId, onComplete]);

  return (
    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <Loader size={48} color="var(--accent-color)" style={{ margin: '0 auto 1.5rem' }} className="animate-spin" />
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Fetching Live Market Prices</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Steam API limits requests to 1 every few seconds to prevent spam.<br/>
        Please wait while we check {stats.total} unique items.
      </p>
      
      <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
        <div style={{ 
          width: `${progress}%`, 
          backgroundColor: 'var(--accent-color)', 
          height: '100%', 
          transition: 'width 0.5s ease-out' 
        }}></div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
        <span>{Math.round(progress)}%</span>
        <span>{stats.fetched} / {stats.total} items</span>
      </div>
      
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default ProgressTracker;
