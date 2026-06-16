import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Briefcase, AlignLeft, Tag, X, AlertCircle, CheckCircle, Eye } from 'lucide-react';

const MAX_DESC = 1000;

const PostJob = () => {
  const [formData, setFormData] = useState({ title: '', description: '', required_skills: '' });
  const [skills,   setSkills]   = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const addSkill = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      const tag = skillInput.trim().replace(/,+$/, '');
      if (tag && !skills.includes(tag)) setSkills(s => [...s, tag]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => setSkills(s => s.filter(x => x !== skill));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...formData, required_skills: skills.join(', ') };
      await api.post('/jobs/', payload);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1600);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="page-content animate-scale-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'var(--success-subtle)', border: '2px solid var(--success-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
        }}>
          <CheckCircle size={38} color="var(--success-light)" />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: '0.5rem' }}>Job Published!</h2>
        <p style={{ color: 'var(--text-2)' }}>Redirecting to your dashboard…</p>
      </div>
    </div>
  );

  return (
    <div className="page-content animate-fade-in">
      <div className="container">

        {/* ── Header ── */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.035em', marginBottom: '0.5rem' }}>
            Post a New Job
          </h1>
          <p style={{ color: 'var(--text-2)' }}>
            Fill in the details. The more specific you are, the better our AI can match candidates.
          </p>
        </div>

        {/* ── Two-column layout ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="post-job-grid">

          {/* ─ Form ─ */}
          <div className="glass-panel">
            {error && (
              <div className="alert alert-error mb-6" role="alert">
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} id="post-job-form">

              {/* Job Title */}
              <div className="input-group">
                <label htmlFor="job-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-display)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)' }}>
                  <Briefcase size={13} /> Job Title
                </label>
                <input
                  id="job-title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Frontend Engineer"
                  required
                />
              </div>

              {/* Description */}
              <div className="input-group">
                <label htmlFor="job-desc" style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlignLeft size={13} /> Description
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    color: formData.description.length > MAX_DESC * 0.9 ? 'var(--warning)' : 'var(--text-3)',
                  }}>
                    {formData.description.length} / {MAX_DESC}
                  </span>
                </label>
                <textarea
                  id="job-desc"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  maxLength={MAX_DESC}
                  placeholder="Describe responsibilities, team culture, and what success looks like in this role…"
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Skills Tag Input */}
              <div className="input-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-display)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)' }}>
                  <Tag size={13} /> Required Skills
                </label>
                {/* Tags display */}
                {skills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                    {skills.map(skill => (
                      <span key={skill} className="skill-tag" style={{ paddingRight: '6px' }}>
                        {skill}
                        <button
                          type="button"
                          className="tag-remove"
                          onClick={() => removeSkill(skill)}
                          aria-label={`Remove ${skill}`}
                          style={{ marginLeft: '4px', lineHeight: 1, background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '0.875rem' }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <input
                  type="text"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={addSkill}
                  placeholder="Type a skill and press Enter or comma…"
                />
                <div className="input-helper-text">e.g. Python, React, SQL — each skill is added separately</div>
              </div>

              <button
                type="submit"
                id="post-job-submit"
                className={`btn btn-primary btn-full${loading ? ' btn-loading' : ''}`}
                disabled={loading || skills.length === 0}
                style={{ marginTop: '0.5rem', padding: '0.8125rem', fontSize: '1rem' }}
              >
                {loading ? <><div className="btn-spinner" /> Publishing…</> : 'Publish Job'}
              </button>
            </form>
          </div>

          {/* ─ Live Preview ─ */}
          <div className="glass-panel" id="job-preview" style={{ alignSelf: 'flex-start', position: 'sticky', top: '90px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', color: 'var(--text-3)', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.04em' }}>
              <Eye size={13} /> LIVE PREVIEW
            </div>

            <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: '1.0625rem', fontWeight: 700, marginBottom: '0.5rem',
                color: formData.title ? 'var(--text-1)' : 'var(--text-4)',
              }}>
                {formData.title || 'Job Title'}
              </h3>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '1rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Briefcase size={11} /> Posted just now
              </div>

              <p style={{
                fontSize: '0.875rem', color: formData.description ? 'var(--text-2)' : 'var(--text-4)',
                lineHeight: 1.6, marginBottom: '1rem',
                display: '-webkit-box', WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {formData.description || 'Job description will appear here…'}
              </p>

              {skills.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {skills.map(s => (
                    <span key={s} className="skill-tag">{s}</span>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-4)', fontStyle: 'italic' }}>Skills will appear here…</div>
              )}
            </div>
          </div>
        </div>

        <style>{`
          @media (min-width: 860px) {
            .post-job-grid { grid-template-columns: 1fr 1fr !important; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default PostJob;
