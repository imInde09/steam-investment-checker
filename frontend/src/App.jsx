import React, { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ProgressTracker from './components/ProgressTracker';
import Dashboard from './components/Dashboard';

function App() {
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [results, setResults] = useState(null);

  const handleUploadSuccess = (id) => {
    setJobId(id);
    setJobStatus('processing');
  };

  const handleJobComplete = (data) => {
    setJobStatus('completed');
    setResults(data);
  };

  const handleReset = () => {
    setJobId(null);
    setJobStatus(null);
    setResults(null);
  };

  return (
    <div className="app-container">
      <Header />
      
      {!jobId && (
        <FileUpload onUploadSuccess={handleUploadSuccess} />
      )}

      {jobId && jobStatus === 'processing' && (
        <ProgressTracker 
          jobId={jobId} 
          onComplete={handleJobComplete} 
        />
      )}

      {jobStatus === 'completed' && results && (
        <Dashboard 
          summary={results.summary} 
          items={results.items} 
          jobId={jobId}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default App;
