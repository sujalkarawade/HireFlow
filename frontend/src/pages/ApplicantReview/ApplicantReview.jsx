import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';
import {
  Users, Mail, TrendingUp, Calendar,
  ChevronDown, ChevronUp, ArrowLeft, CheckCircle, XCircle, Eye
} from 'lucide-react';
import './ApplicantReview.css';

/* ── Score bar ── */
const ScoreBar = ({ score }) => {
  const pct    = Math.min(Math.max(score, 0), 100);
  // dynamic colors based on score
  const color  = pct >= 75 ? 'var(--success)' : pct >= 50 ? 'var(--secondary)' : pct >= 30 ? 'var(--warning)' : 'var(--danger)';
  const fill   = pct >= 75 ? 'progress-fill-success' : pct >= 50 ? 'progress-fill-primary' : 'progress-fill-warning';

  return (
    <div className="score-bar-section">
      <div className="score-bar-header-row">
        <span className="score-bar-lbl">Match Score</span>
        <span className="score-bar-val" style={{ color }}>{pct}%</span>
      </div>
      <div className="progress-bar">
        <div className={`progress-fill ${fill}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

/* ── Status map ── */
const STATUS_MAP = {
  applied:     { label: 'Applied',     cls: 'badge-secondary' },
  reviewing:   { label: 'Reviewing',   cls: 'badge-info' },
  interviewed: { label: 'Interviewed', cls: 'badge-primary' },
  accepted:    { label: 'Accepted',    cls: 'badge-success' },
  rejected:    { label: 'Rejected',    cls: 'badge-danger' },
};

/* ── Applicant Card ── */
const ApplicantCard = ({ app, onUpdateStatus, onSchedule }) => {
  const [expanded,   setExpanded]   = useState(false);
  const [date,       setDate]       = useState('');
  const [link,       setLink]       = useState('');
  const [submitting, setSubmitting] = useState(false);

  const status = STATUS_MAP[app.status] || STATUS_MAP.applied;
  const skills = app.job?.required_skills?.split(',').map(s => s.trim()).filter(Boolean) || [];

  const handleSchedule = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onSchedule(app.id, date, link);
    setExpanded(false);
    setDate(''); setLink('');
    setSubmitting(false);
  };

  return (
    <div className="glass-panel applicant-card animate-fade-up">

      {/* Top row */}
      <div className="applicant-top-row">
        <div className="candidate-meta">
          <div className="candidate-avatar">
            {app.candidate?.full_name?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div>
            <div className="candidate-name">{app.candidate?.full_name}</div>
            <div className="candidate-email">
              <Mail size={12} />
              {app.candidate?.email}
            </div>
          </div>
        </div>
        <span className={`badge badge-dot ${status.cls}`}>{status.label}</span>
      </div>

      {/* Score bar */}
      <ScoreBar score={app.match_score ?? 0} />

      {/* Skill chips */}
      {skills.length > 0 && (
        <div className="applicant-skills-row">
          {skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
        </div>
      )}

      {/* Actions */}
      <div className="applicant-actions">
        <button
          onClick={() => onUpdateStatus(app.id, 'reviewing')}
          className="btn btn-sm btn-outline"
          disabled={app.status === 'reviewing'}
        >
          <Eye size={13} /> Mark Reviewing
        </button>

        <button
          onClick={() => setExpanded(e => !e)}
          className={`btn btn-sm ${expanded ? 'btn-secondary' : 'btn-primary'}`}
        >
          <Calendar size={13} />
          {expanded ? 'Cancel' : 'Schedule Interview'}
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        <button
          onClick={() => onUpdateStatus(app.id, 'accepted')}
          className="btn btn-sm btn-success"
          disabled={app.status === 'accepted'}
        >
          <CheckCircle size={13} /> Accept
        </button>

        <button
          onClick={() => onUpdateStatus(app.id, 'rejected')}
          className="btn btn-sm btn-danger"
          disabled={app.status === 'rejected'}
        >
          <XCircle size={13} /> Reject
        </button>
      </div>

      {/* Expandable interview scheduler */}
      {expanded && (
        <div className="scheduler-panel">
          <h4 className="scheduler-heading">
            Schedule Interview — {app.candidate?.full_name}
          </h4>
          <form onSubmit={handleSchedule}>
            <div className="scheduler-fields-grid">
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label htmlFor={`date-${app.id}`} className="scheduler-field-label">
                  Date &amp; Time
                </label>
                <input
                  id={`date-${app.id}`}
                  type="datetime-local"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label htmlFor={`link-${app.id}`} className="scheduler-field-label">
                  Meeting Link
                </label>
                <input
                  id={`link-${app.id}`}
                  type="url"
                  value={link}
                  onChange={e => setLink(e.target.value)}
                  placeholder="https://zoom.us/j/..."
                  required
                />
              </div>
            </div>
            <div className="scheduler-actions">
              <button
                type="submit"
                className={`btn btn-secondary${submitting ? ' btn-loading' : ''}`}
                disabled={submitting}
              >
                {submitting
                  ? <><div className="btn-spinner" />Scheduling…</>
                  : <><CheckCircle size={14} />Confirm Interview</>
                }
              </button>
              <button type="button" onClick={() => setExpanded(false)} className="btn btn-ghost btn-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

/* ── Main Page ── */
const ApplicantReview = () => {
  const { jobId }      = useParams();
  const [applications, setApplications] = useState([]);
  const [job,          setJob]          = useState(null);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/jobs/${jobId}`),
      api.get(`/applications/job/${jobId}`),
    ])
      .then(([jobRes, appsRes]) => {
        setJob(jobRes.data);
        setApplications(appsRes.data.sort((a, b) => (b.match_score ?? 0) - (a.match_score ?? 0)));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [jobId]);

  const updateStatus = async (appId, newStatus) => {
    try {
      await api.put(`/applications/${appId}/status?status=${newStatus}`);
      setApplications(apps => apps.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    } catch {
      alert('Failed to update status');
    }
  };

  const scheduleInterview = async (appId, date, link) => {
    try {
      await api.post(`/interviews/application/${appId}`, {
        scheduled_at: new Date(date).toISOString(),
        meeting_link: link,
      });
      updateStatus(appId, 'interviewed');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to schedule');
    }
  };

  if (loading) return (
    <div className="loading-page">
      <div className="spinner" />
      <span>Loading applicants…</span>
    </div>
  );

  const avgScore = applications.length
    ? Math.round(applications.reduce((s, a) => s + (a.match_score ?? 0), 0) / applications.length)
    : 0;
  const topMatch = applications[0]?.match_score ?? 0;

  return (
    <div className="page-content animate-fade-in">
      <div className="container">

        {/* ── Header ── */}
        <div className="review-header">
          <Link to="/dashboard" className="btn btn-ghost btn-sm review-back-link">
            <ArrowLeft size={15} /> Back to Dashboard
          </Link>
          <h1 className="review-title">{job?.title}</h1>
          {job?.required_skills && (
            <div className="review-skills-row">
              {job.required_skills.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                <span key={s} className="skill-tag">{s}</span>
              ))}
            </div>
          )}
        </div>

        {/* ── Stats strip ── */}
        <div className="review-stats-grid">
          {[
            { label: 'Total Applicants', value: applications.length, icon: Users,         variant: 'primary' },
            { label: 'Average Match',    value: `${avgScore}%`,       icon: TrendingUp,    variant: 'secondary' },
            { label: 'Top Match',        value: `${topMatch}%`,        icon: CheckCircle,  variant: 'success' },
          ].map(({ label, value, icon: Icon, variant }, i) => (
            <div key={label} className={`stat-card stat-card-${variant} animate-fade-up delay-${i + 1}`}>
              <div className={`stat-icon stat-icon-${variant}`} style={{ marginBottom: '0.5rem' }}>
                <Icon size={18} />
              </div>
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* ── Applicants ── */}
        {applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Users size={28} /></div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '0.5rem' }}>No applicants yet</h3>
            <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>Share this job to start receiving applications.</p>
          </div>
        ) : (
          <div className="applicant-list">
            {applications.map(app => (
              <ApplicantCard
                key={app.id}
                app={app}
                onUpdateStatus={updateStatus}
                onSchedule={scheduleInterview}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantReview;
