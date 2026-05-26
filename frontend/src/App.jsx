import React, { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';

function App() {
  const [jobId, setJobId] = useState(null);

  const handleUploadSuccess = (id) => {
    setJobId(id);
  };

  const handleReset = () => {
    setJobId(null);
  };

  return (
    <div className="app-container">
      <Header jobId={jobId} onReset={handleReset} />
      
      <main style={{ padding: '2rem', flex: 1, width: '100%' }}>
        {!jobId && (
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        )}

        {jobId && (
          <Dashboard jobId={jobId} />
        )}
      </main>
    </div>
  );
}

export default App;
