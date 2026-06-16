import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { Search, Briefcase, Clock, Tag, CheckCircle, Loader } from 'lucide-react';

const JobBoard = () => {
  const [jobs,       setJobs]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [activeTag,  setActiveTag]  = useState(null);
  const [applying,   setApplying]   = useState(null);
  const [applied,    setApplied]    = useState(new Set());
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs/');
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
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

  // Gather all unique skills for filter pills
  const allSkills = [...new Set(
    jobs.flatMap(j => j.required_skills.split(',').map(s => s.trim()).filter(Boolean))
  )].slice(0, 12);

  const filtered = jobs.filter(job => {
    const matchSearch = !search || job.title.toLowerCase().includes(search.toLowerCase()) || job.description.toLowerCase().includes(search.toLowerCase());
    const matchTag    = !activeTag || job.required_skills.toLowerCase().includes(activeTag.toLowerCase());
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
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.035em', marginBottom: '0.5rem' }}>
            Job Board
          </h1>
          <p style={{ color: 'var(--text-2)' }}>
            {jobs.length} open {jobs.length === 1 ? 'position' : 'positions'} available
          </p>
        </div>

        {/* ── Search + Filters ── */}
        <div style={{ marginBottom: '2rem' }}>
          {/* Search bar */}
          <div style={{ position: 'relative', marginBottom: '1rem', maxWidth: '540px' }}>
            <Search size={16} style={{
              position: 'absolute', left: '14px', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder="Search jobs by title or keyword…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '0.6875rem 1rem 0.6875rem 2.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-input)', color: 'var(--text-1)',
                fontSize: '0.9375rem', fontFamily: 'var(--font-body)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                outline: 'none',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--primary-light)';
                e.target.style.boxShadow   = '0 0 0 3px var(--primary-glow)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'var(--border-medium)';
                e.target.style.boxShadow   = 'none';
              }}
            />
          </div>

          {/* Skill filter pills */}
          {allSkills.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginRight: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Tag size={12} /> Filter:
              </span>
              <button
                onClick={() => setActiveTag(null)}
                style={{
                  padding: '4px 12px', borderRadius: '9999px', fontSize: '0.8rem',
                  fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                  border: `1px solid ${!activeTag ? 'var(--primary-light)' : 'var(--border-medium)'}`,
                  background: !activeTag ? 'var(--primary-subtle)' : 'transparent',
                  color: !activeTag ? '#c4b5fd' : 'var(--text-2)',
                }}
              >
                All
              </button>
              {allSkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => setActiveTag(activeTag === skill ? null : skill)}
                  style={{
                    padding: '4px 12px', borderRadius: '9999px', fontSize: '0.8rem',
                    fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                    border: `1px solid ${activeTag === skill ? 'var(--primary-light)' : 'var(--border)'}`,
                    background: activeTag === skill ? 'var(--primary-subtle)' : 'rgba(255,255,255,0.02)',
                    color: activeTag === skill ? '#c4b5fd' : 'var(--text-2)',
                  }}
                >
                  {skill}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Job Cards ── */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Briefcase size={28} /></div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '0.5rem' }}>No jobs found</h3>
            <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-2" style={{ gap: '1.25rem' }}>
            {filtered.map((job, i) => {
              const skills     = job.required_skills.split(',').map(s => s.trim()).filter(Boolean);
              const isApplied  = applied.has(job.id);
              const isApplying = applying === job.id;

              return (
                <div key={job.id} className={`glass-panel card-glow animate-fade-up delay-${Math.min(i + 1, 5)}`}
                  style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>

                  {/* Card header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.0625rem', fontWeight: 700, marginBottom: '0' }}>
                        {job.title}
                      </h3>
                    </div>
                    {isApplied && (
                      <span className="badge badge-success" style={{ flexShrink: 0 }}>
                        <CheckCircle size={11} /> Applied
                      </span>
                    )}
                  </div>

                  {/* Meta */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-3)', fontSize: '0.75rem', marginBottom: '1rem' }}>
                    <Clock size={12} />
                    Posted {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>

                  {/* Description */}
                  <p style={{
                    color: 'var(--text-2)', fontSize: '0.875rem', lineHeight: 1.6,
                    marginBottom: '1.25rem', flex: 1,
                    display: '-webkit-box', WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {job.description}
                  </p>

                  {/* Skills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.25rem' }}>
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

                  {/* CTA */}
                  {user?.role === 'candidate' && (
                    <button
                      onClick={() => !isApplied && handleApply(job.id)}
                      disabled={isApplied || isApplying}
                      className={`btn ${isApplied ? 'btn-success' : 'btn-primary'}${isApplying ? ' btn-loading' : ''}`}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {isApplying ? (
                        <><div className="btn-spinner" /> Applying…</>
                      ) : isApplied ? (
                        <><CheckCircle size={15} /> Applied!</>
                      ) : (
                        'Apply Now'
                      )}
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
