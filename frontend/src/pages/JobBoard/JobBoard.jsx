import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api';
import { Search, Briefcase, Clock, Tag, CheckCircle } from 'lucide-react';
import './JobBoard.css';

const JobBoard = () => {
  const [jobs,      setJobs]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [activeTag, setActiveTag] = useState(null);
  const [applying,  setApplying]  = useState(null);
  const [applied,   setApplied]   = useState(new Set());
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get('/jobs/')
      .then(r => setJobs(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleApply = async (jobId) => {
    setApplying(jobId);
    try {
      await api.post('/applications/', { job_id: jobId });
      setApplied(prev => new Set([...prev, jobId]));
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to apply');
    } finally {
      setApplying(null);
    }
  };

  // Unique skill tags for filter pills (max 12)
  const allSkills = [...new Set(
    jobs.flatMap(j => j.required_skills.split(',').map(s => s.trim()).filter(Boolean))
  )].slice(0, 12);

  const filtered = jobs.filter(job => {
    const matchSearch = !search ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase());
    const matchTag = !activeTag ||
      job.required_skills.toLowerCase().includes(activeTag.toLowerCase());
    return matchSearch && matchTag;
  });

  if (loading) return (
    <div className="loading-page">
      <div className="spinner" />
      <span>Loading jobs…</span>
    </div>
  );

  return (
    <div className="page-content animate-fade-in">
      <div className="container">

        {/* ── Header ── */}
        <div className="jobboard-header">
          <h1 className="jobboard-title">Job Board</h1>
          <p className="jobboard-count">
            {jobs.length} open {jobs.length === 1 ? 'position' : 'positions'} available
          </p>
        </div>

        {/* ── Search ── */}
        <div className="jobboard-search-wrap">
          <span className="jobboard-search-icon"><Search size={16} /></span>
          <input
            type="text"
            placeholder="Search jobs by title or keyword…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="jobboard-search-input"
          />
        </div>

        {/* ── Filter pills ── */}
        {allSkills.length > 0 && (
          <div className="filter-pills-row">
            <span className="filter-pills-label"><Tag size={12} /> Filter:</span>

            <button
              onClick={() => setActiveTag(null)}
              className={`filter-pill${!activeTag ? ' active' : ''}`}
            >
              All
            </button>

            {allSkills.map(skill => (
              <button
                key={skill}
                onClick={() => setActiveTag(activeTag === skill ? null : skill)}
                className={`filter-pill${activeTag === skill ? ' active' : ''}`}
              >
                {skill}
              </button>
            ))}
          </div>
        )}

        {/* ── Job cards ── */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Briefcase size={28} /></div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '0.5rem' }}>No jobs found</h3>
            <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {filtered.map((job, i) => {
              const skills     = job.required_skills.split(',').map(s => s.trim()).filter(Boolean);
              const isApplied  = applied.has(job.id);
              const isApplying = applying === job.id;

              return (
                <div key={job.id} className={`glass-panel card-glow job-card animate-fade-up delay-${Math.min(i + 1, 5)}`}>

                  <div className="job-card-header">
                    <h3 className="job-card-title">{job.title}</h3>
                    {isApplied && (
                      <span className="badge badge-success" style={{ flexShrink: 0 }}>
                        <CheckCircle size={11} /> Applied
                      </span>
                    )}
                  </div>

                  <div className="job-card-meta">
                    <Clock size={12} />
                    Posted {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>

                  <p className="job-card-desc">{job.description}</p>

                  <div className="job-card-skills">
                    {skills.slice(0, 5).map(skill => (
                      <span
                        key={skill}
                        className="skill-tag"
                        onClick={() => setActiveTag(skill)}
                        style={{ cursor: 'pointer' }}
                      >
                        {skill}
                      </span>
                    ))}
                    {skills.length > 5 && (
                      <span className="badge" style={{ fontSize: '0.7rem' }}>+{skills.length - 5} more</span>
                    )}
                  </div>

                  {user?.role === 'candidate' && (
                    <button
                      onClick={() => !isApplied && handleApply(job.id)}
                      disabled={isApplied || isApplying}
                      className={`btn ${isApplied ? 'btn-success' : 'btn-primary'}${isApplying ? ' btn-loading' : ''}`}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {isApplying
                        ? <><div className="btn-spinner" />Applying…</>
                        : isApplied
                          ? <><CheckCircle size={15} />Applied!</>
                          : 'Apply Now'
                      }
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobBoard;
