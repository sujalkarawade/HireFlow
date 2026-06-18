import { useState, useEffect, useCallback } from 'react';
import { X, FileText, CheckCircle, XCircle, Loader, FileDown, Sparkles, Briefcase, GraduationCap, Zap, Award } from 'lucide-react';
import api from '../api';
import './ResumeDrawer.css';

const ResumeDrawer = ({ candidateId, candidateName, jobRequiredSkills, onClose }) => {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  const fetchResume = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/resumes/candidate/${candidateId}`);
      setResumeData(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load resume');
    } finally {
      setLoading(false);
    }
  }, [candidateId]);

  useEffect(() => {
    if (candidateId) fetchResume();
  }, [candidateId, fetchResume]);

  // Parse job required skills
  const requiredSkills = (jobRequiredSkills || '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  // Derive matched vs. missing skills from the resume text
  const resumeText = resumeData?.extracted_text || '';
  const matchedSkills = requiredSkills.filter(skill => resumeText.includes(skill));
  const missingSkills = requiredSkills.filter(skill => !resumeText.includes(skill));

  // Fetch summary
  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const res = await api.post(`/resumes/summary/${candidateId}`);
      setSummary(res.data);
    } catch (err) {
      setSummaryError(err.response?.data?.detail || 'Failed to generate summary');
    } finally {
      setSummaryLoading(false);
    }
  }, [candidateId]);

  // Build file URL for download/view
  const fileUrl = resumeData?.file_path
    ? `http://localhost:8000/${resumeData.file_path.replace(/\\/g, '/')}`
    : null;

  const handleCloseOverlay = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <>
      <div className="drawer-overlay" onClick={handleCloseOverlay} />
      <div className="drawer-panel">
        {/* Header */}
        <div className="drawer-header">
          <h2>
            <FileText size={18} />
            {candidateName || 'Resume'} Review
          </h2>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close drawer">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {loading && (
            <div className="drawer-loading">
              <Loader size={20} className="spinner" />
              Loading resume…
            </div>
          )}

          {error && (
            <div className="drawer-error">{error}</div>
          )}

          {!loading && !error && resumeData && (
            <>
              {/* Generate Summary Button */}
              <button
                onClick={fetchSummary}
                disabled={summaryLoading}
                className="generate-summary-btn"
              >
                {summaryLoading ? (
                  <><Loader size={16} className="spinner" /> Generating…</>
                ) : (
                  <><Sparkles size={16} /> Generate Resume Summary</>
                )}
              </button>

              {/* Summary Section */}
              {summary && (
                <div className="summary-section">
                  <h3><Sparkles size={14} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />AI-Powered Summary</h3>

                  <div className="summary-overall-box">
                    <div className="summary-subsection">
                      <div className="summary-subsection-label"><Zap size={12} /> Overall Profile</div>
                      <div className="summary-subsection-value">{summary.summary_text}</div>
                    </div>
                  </div>

                  <div className="summary-subsection">
                    <div className="summary-subsection-label"><Briefcase size={12} /> Experience</div>
                    <div className="summary-subsection-value">{summary.experience_summary}</div>
                  </div>

                  <div className="summary-subsection">
                    <div className="summary-subsection-label"><GraduationCap size={12} /> Education</div>
                    <div className="summary-subsection-value">{summary.education_summary}</div>
                  </div>

                  <div className="summary-subsection">
                    <div className="summary-subsection-label"><Zap size={12} /> Skills Highlight</div>
                    <div className="skills-highlight-value">{summary.skills_highlight}</div>
                  </div>

                  <div className="summary-subsection">
                    <div className="summary-subsection-label"><Award size={12} /> Key Strengths</div>
                    <div className="summary-subsection-value">{summary.key_strengths}</div>
                  </div>

                  {summaryError && (
                    <div className="drawer-error" style={{ marginTop: '0.5rem' }}>{summaryError}</div>
                  )}
                </div>
              )}
              {/* Matched vs Missing Skills */}
              {requiredSkills.length > 0 && (
                <div className="skills-summary-section">
                  <h3>Skill Match Summary</h3>
                  <div className="skills-chips-grid">
                    {matchedSkills.map(skill => (
                      <span key={skill} className="skill-chip matched">
                        <CheckCircle className="chip-icon" size={14} />
                        {skill}
                      </span>
                    ))}
                    {missingSkills.map(skill => (
                      <span key={skill} className="skill-chip missing">
                        <XCircle className="chip-icon" size={14} />
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="skills-stats-row">
                    <span className="skills-stat">
                      <span className="stat-dot matched-dot" />
                      Matched: {matchedSkills.length}/{requiredSkills.length}
                    </span>
                    <span className="skills-stat">
                      <span className="stat-dot missing-dot" />
                      Missing: {missingSkills.length}/{requiredSkills.length}
                    </span>
                  </div>
                </div>
              )}

              {/* Parsed Resume Text */}
              <div className="resume-text-section">
                <h3>Parsed Resume Text</h3>
                <div className="resume-text-area">
                  {resumeText || <em style={{ opacity: 0.5 }}>No text extracted</em>}
                </div>
              </div>

              {/* Download/View PDF */}
              {fileUrl && (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="drawer-pdf-btn"
                >
                  <FileDown size={16} />
                  Download / View PDF Resume
                </a>
              )}
            </>
          )}

          {!loading && !error && !resumeData && (
            <div className="drawer-error">No resume found for this candidate.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResumeDrawer;