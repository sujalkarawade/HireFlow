import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Briefcase, AlignLeft, Tag, AlertCircle, CheckCircle, Eye } from 'lucide-react';
import './PostJob.css';

const MAX_DESC = 1000;

const PostJob = () => {
  const [formData,    setFormData]    = useState({ title: '', description: '', required_skills: '' });
  const [skills,      setSkills]      = useState([]);
  const [skillInput,  setSkillInput]  = useState('');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

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
      await api.post('/jobs/', { ...formData, required_skills: skills.join(', ') });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1600);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="postjob-success animate-scale-in">
      <div className="postjob-success-inner">
        <div className="success-icon-wrap">
          <CheckCircle size={38} color="var(--success-light)" />
        </div>
        <h2 className="success-title">Job Published!</h2>
        <p className="success-sub">Redirecting to your dashboard…</p>
      </div>
    </div>
  );

  return (
    <div className="page-content animate-fade-in">
      <div className="container">

        {/* ── Header ── */}
        <div className="postjob-header">
          <h1 className="postjob-title">Post a New Job</h1>
          <p className="postjob-sub">
            Fill in the details. The more specific you are, the better our AI can match candidates.
          </p>
        </div>

        <div className="postjob-grid">

          {/* ─ Form Panel ─ */}
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
                <label htmlFor="job-title" className="form-label-icon-text">
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
                <div className="form-label-row">
                  <span className="form-label-icon-text">
                    <AlignLeft size={13} /> Description
                  </span>
                  {/* char counter color is dynamic */}
                  <span
                    className="char-count"
                    style={{
                      color: formData.description.length > MAX_DESC * 0.9
                        ? 'var(--warning)'
                        : 'var(--text-3)',
                    }}
                  >
                    {formData.description.length} / {MAX_DESC}
                  </span>
                </div>
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

              {/* Skills tag input */}
              <div className="input-group">
                <label className="form-label-icon-text">
                  <Tag size={13} /> Required Skills
                </label>

                {skills.length > 0 && (
                  <div className="skill-tags-display">
                    {skills.map(skill => (
                      <span key={skill} className="skill-tag">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          aria-label={`Remove ${skill}`}
                          style={{
                            marginLeft: '4px', background: 'none', border: 'none',
                            color: 'inherit', cursor: 'pointer', fontSize: '0.875rem', lineHeight: 1,
                          }}
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
                <div className="input-helper-text">
                  e.g. Python, React, SQL — each skill is added separately
                </div>
              </div>

              <button
                type="submit"
                id="post-job-submit"
                className={`btn btn-primary btn-full${loading ? ' btn-loading' : ''}`}
                disabled={loading || skills.length === 0}
                style={{ marginTop: '0.5rem', padding: '0.8125rem', fontSize: '1rem' }}
              >
                {loading
                  ? <><div className="btn-spinner" />Publishing…</>
                  : 'Publish Job'
                }
              </button>
            </form>
          </div>

          {/* ─ Live Preview Panel ─ */}
          <div className="glass-panel postjob-preview-panel">
            <div className="preview-label">
              <Eye size={13} /> LIVE PREVIEW
            </div>

            <div className="preview-card">
              <h3 className={`preview-title${!formData.title ? ' preview-title-empty' : ''}`}>
                {formData.title || 'Job Title'}
              </h3>

              <div className="preview-meta">
                <Briefcase size={11} /> Posted just now
              </div>

              <p className={`preview-desc${!formData.description ? ' preview-desc-empty' : ''}`}>
                {formData.description || 'Job description will appear here…'}
              </p>

              {skills.length > 0 ? (
                <div className="preview-skills">
                  {skills.map(s => (
                    <span key={s} className="skill-tag">{s}</span>
                  ))}
                </div>
              ) : (
                <span className="preview-skills-empty">Skills will appear here…</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
