import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import {
  Users, Mail, TrendingUp, Calendar, Link as LinkIcon,
  ChevronDown, ChevronUp, ArrowLeft, CheckCircle, XCircle, Eye
} from 'lucide-react';

/* ── Score bar ── */
const ScoreBar = ({ score }) => {
  const pct   = Math.min(Math.max(score, 0), 100);
  const color = pct >= 75 ? 'var(--success)' : pct >= 50 ? 'var(--secondary)' : pct >= 30 ? 'var(--warning)' : 'var(--danger)';
  const fill  = pct >= 75 ? 'progress-fill-success' : pct >= 50 ? 'progress-fill-primary' : 'progress-fill-warning';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8125rem' }}>
        <span style={{ color: 'var(--text-3)', fontWeight: 500 }}>Match Score</span>
        <span style={{ color, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{pct}%</span>
      </div>
      <div className="progress-bar">
        <div className={`progress-fill ${fill}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

/* ── Status badge map ── */
const STATUS_MAP = {
  applied:     { label: 'Applied',     cls: 'badge-secondary' },
  reviewing:   { label: 'Reviewing',   cls: 'badge-info' },
  interviewed: { label: 'Interviewed', cls: 'badge-primary' },
  accepted:    { label: 'Accepted',    cls: 'badge-success' },
  rejected:    { label: 'Rejected',    cls: 'badge-danger' },
};

/* ── Applicant Card ── */
const ApplicantCard = ({ app, onUpdateStatus, onSchedule }) => {
  const [expanded, setExpanded] = useState(false);
  const [date,     setDate]     = useState('');
  const [link,     setLink]     = useState('');
  const [submitting, setSubmit] = useState(false);

  const status = STATUS_MAP[app.status] || STATUS_MAP.applied;

  const handleSchedule = async (e) => {
    e.preventDefault();
    setSubmit(true);
    await onSchedule(app.id, date, link);
    setExpanded(false);
    setDate(''); setLink('');
    setSubmit(false);
  };

  const skills = app.job?.required_skills?.split(',').map(s => s.trim()).filter(Boolean) || [];

  return (
    <div className="glass-panel animate-fade-up" style={{ padding: '1.5rem' }}>
      {/* ── Top row ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        {/* Candidate info */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', minWidth: 0 }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'white',
          }}>
            {app.candidate?.full_name?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-1)', marginBottom: '2px' }}>
              {app.candidate?.full_name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8125rem', color: 'var(--text-3)' }}>
              <Mail size={12} />
              {app.candidate?.email}
            </div>
          </div>
        </div>

        {/* Status badge */}
        <span className={`badge badge-dot ${status.cls}`}>{status.label}</span>
      </div>

      {/* Score bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <ScoreBar score={app.match_score ?? 0} />
      </div>

      {/* Required skills chips */}
      {skills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.25rem' }}>
          {skills.map(s => (
            <span key={s} className="skill-tag">{s}</span>
          ))}
        </div>
      )}

      {/* ── Action buttons ── */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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

      {/* ── Interview Scheduler (expandable) ── */}
      {expanded && (
        <div style={{
          marginTop: '1.25rem',
          padding: '1.25rem',
          background: 'rgba(6,182,212,0.05)',
          border: '1px solid rgba(6,182,212,0.2)',
          borderRadius: 'var(--radius-lg)',
          animation: 'fadeUp 0.25s var(--ease-out) both',
        }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--secondary)' }}>
            Schedule Interview — {app.candidate?.full_name}
          </h4>
          <form onSubmit={handleSchedule}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label htmlFor={`date-${app.id}`} style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)' }}>
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
                <label htmlFor={`link-${app.id}`} style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)' }}>
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
            <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
              <button
                type="submit"
                className={`btn btn-secondary${submitting ? ' btn-loading' : ''}`}
                disabled={submitting}
              >
                {submitting ? <><div className="btn-spinner" />Scheduling…</> : <><CheckCircle size={14} /> Confirm Interview</>}
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
  const { jobId }       = useParams();
  const [applications,  setApplications] = useState([]);
  const [job,           setJob]          = useState(null);
  const [loading,       setLoading]      = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, appsRes] = await Promise.all([
          api.get(`/jobs/${jobId}`),
          api.get(`/applications/job/${jobId}`),
        ]);
        setJob(jobRes.data);
        setApplications(appsRes.data.sort((a, b) => (b.match_score ?? 0) - (a.match_score ?? 0)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/dashboard" className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem', paddingLeft: 0 }}>
            <ArrowLeft size={15} /> Back to Dashboard
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, letterSpacing: '-0.035em', marginBottom: '0.5rem' }}>
            {job?.title}
          </h1>
          {job?.required_skills && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {job.required_skills.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                <span key={s} className="skill-tag">{s}</span>
              ))}
            </div>
          )}
        </div>

        {/* ── Stats strip ── */}
        <div className="grid grid-3" style={{ gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Applicants', value: applications.length, icon: Users },
            { label: 'Average Match',    value: `${avgScore}%`,       icon: TrendingUp },
            { label: 'Top Match',        value: `${topMatch}%`,        icon: CheckCircle },
          ].map(({ label, value, icon: Icon }, i) => (
            <div key={label} className={`stat-card stat-card-primary animate-fade-up delay-${i + 1}`}>
              <div className="stat-icon stat-icon-primary" style={{ marginBottom: '0.5rem' }}>
                <Icon size={18} />
              </div>
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* ── Applicant Cards ── */}
        {applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Users size={28} /></div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '0.5rem' }}>No applicants yet</h3>
            <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>
              Share this job to start receiving applications.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
