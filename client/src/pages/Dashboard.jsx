import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle, Download, Briefcase, ChevronRight, BrainCircuit } from 'lucide-react';
import useAnalysisStore from '../store/useAnalysisStore';

const Dashboard = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  
  const { analyzeResume, analysisResult, historyId, isLoading, error, downloadResumePdf, isGeneratingPdf, clearAnalysis } = useAnalysisStore();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !jobDescription) return;

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      await analyzeResume(formData);
    } catch (err) {
      // Handled in store
    }
  };

  const handleDownloadPdf = () => {
    if (historyId) {
      downloadResumePdf(historyId);
    }
  };

  if (analysisResult) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '2rem 0' }}>
        <button onClick={clearAnalysis} className="btn-secondary" style={{ marginBottom: '2rem' }}>
          &larr; New Analysis
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          
          {/* Match Score & ATS Download */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Match Score</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  fontSize: '3rem', 
                  fontWeight: 800, 
                  color: analysisResult.matchPercentage > 75 ? 'var(--color-success)' : analysisResult.matchPercentage > 50 ? '#f59e0b' : 'var(--color-error)' 
                }}>
                  {analysisResult.matchPercentage}%
                </div>
              </div>
            </div>
            <button 
              onClick={handleDownloadPdf} 
              disabled={isGeneratingPdf}
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Download size={20} />
              {isGeneratingPdf ? 'Generating...' : 'Download ATS Resume'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Skills */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--color-success)' }}>
                <CheckCircle size={24} /> Matching Skills
              </h3>
              <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', listStyle: 'none', padding: 0 }}>
                {(analysisResult.matchingSkills || []).map((skill, i) => (
                  <li key={i} style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', padding: '0.25rem 0.75rem', borderRadius: '16px', fontSize: '0.875rem' }}>
                    {skill}
                  </li>
                ))}
              </ul>

              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem', marginBottom: '1.5rem', color: 'var(--color-error)' }}>
                <Briefcase size={24} /> Skill Gaps
              </h3>
              <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', listStyle: 'none', padding: 0 }}>
                {(analysisResult.skillGaps || []).map((skill, i) => (
                  <li key={i} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)', padding: '0.25rem 0.75rem', borderRadius: '16px', fontSize: '0.875rem' }}>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            {/* Preparation Plan */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Preparation Plan</h3>
              <p style={{ color: 'var(--color-text-muted)', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                {analysisResult.prepPlan || 'No preparation plan provided.'}
              </p>
            </div>
          </div>

          {/* Interview Questions */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Technical Questions</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(analysisResult.technicalQuestions || []).map((q, i) => (
                <li key={i} style={{ display: 'flex', gap: '1rem', background: 'rgba(15, 23, 42, 0.4)', padding: '1rem', borderRadius: '8px' }}>
                  <ChevronRight color="var(--color-primary)" style={{ flexShrink: 0 }} />
                  <span>{q}</span>
                </li>
              ))}
            </ul>

            <h3 style={{ marginTop: '2.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Behavioral Questions</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(analysisResult.behavioralQuestions || []).map((q, i) => (
                <li key={i} style={{ display: 'flex', gap: '1rem', background: 'rgba(15, 23, 42, 0.4)', padding: '1rem', borderRadius: '8px' }}>
                  <ChevronRight color="var(--color-secondary)" style={{ flexShrink: 0 }} />
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
          
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>New Analysis</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Upload your resume and the job description to get started.</p>
      
      {error && <div style={{ color: 'var(--color-error)', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '2rem' }}>
          <label className="label">Upload Resume (PDF only)</label>
          <div 
            onClick={() => fileInputRef.current.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{ 
              border: `2px dashed ${file ? 'var(--color-primary)' : 'var(--color-border)'}`, 
              borderRadius: '12px', 
              padding: '3rem 2rem', 
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: file ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
              transition: 'all var(--transition-fast)'
            }}
          >
            <UploadCloud size={48} color={file ? 'var(--color-primary)' : 'var(--color-text-muted)'} style={{ marginBottom: '1rem' }} />
            {file ? (
              <div>
                <p style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{file.name}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Click or drag to replace</p>
              </div>
            ) : (
              <div>
                <p style={{ fontWeight: 600 }}>Click to upload or drag and drop</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>PDF up to 5MB</p>
              </div>
            )}
            <input 
              type="file" 
              accept=".pdf" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label className="label">Job Description</label>
          <textarea 
            className="input-field" 
            rows="8" 
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
            style={{ resize: 'vertical' }}
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={!file || !jobDescription || isLoading}
          style={{ width: '100%', padding: '1rem', fontSize: '1.125rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}
        >
          {isLoading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <BrainCircuit />
            </motion.div>
          ) : <FileText />}
          {isLoading ? 'Analyzing Profile...' : 'Analyze Match'}
        </button>
      </form>
    </motion.div>
  );
};

export default Dashboard;
