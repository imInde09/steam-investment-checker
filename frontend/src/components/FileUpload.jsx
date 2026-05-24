import React, { useState } from 'react';
import { Upload, File, Loader } from 'lucide-react';
import { apiClient } from '../api/client';

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.name.endsWith('.csv')) {
      setFile(selected);
      setError('');
    } else {
      setFile(null);
      setError('Please select a valid CSV file.');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await apiClient.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUploadSuccess(response.data.job_id);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload file');
      setUploading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <div 
        style={{
          border: '2px dashed var(--border-color)',
          borderRadius: '1rem',
          padding: '3rem 2rem',
          marginBottom: '1.5rem',
          cursor: 'pointer',
          transition: 'border-color 0.2s'
        }}
        onClick={() => document.getElementById('file-upload').click()}
      >
        <Upload size={48} color="var(--text-secondary)" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Upload Market History CSV</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Click to browse or drag and drop</p>
        <input 
          id="file-upload" 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
        />
      </div>

      {file && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <File size={20} color="var(--accent-color)" />
          <span>{file.name}</span>
        </div>
      )}

      {error && (
        <div style={{ color: 'var(--danger-color)', marginBottom: '1.5rem' }}>{error}</div>
      )}

      <button 
        onClick={handleUpload}
        disabled={!file || uploading}
        style={{
          backgroundColor: 'var(--accent-color)',
          color: 'white',
          border: 'none',
          padding: '0.75rem 2rem',
          borderRadius: '0.5rem',
          fontSize: '1rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          width: '100%',
          opacity: (!file || uploading) ? 0.7 : 1
        }}
      >
        {uploading ? <Loader className="animate-spin" /> : 'Analyze Data'}
      </button>
      
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default FileUpload;
