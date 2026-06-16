import React, { useState, useEffect } from 'react';
import api from '../../api';
import { ClipboardList, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import './ApplicationTracker.css';

/* ── Match Score Ring (SVG) ── */
const MatchRing = ({ score }) => {
  const r    = 26;
  const circ = 2 * Math.PI * r;
  const pct  = Math.min(Math.max(score, 0), 100) / 100;
  const dash = circ * pct;
  // color is dynamic — must stay inline
  const color = score >= 75 ? 'var(--success)' : score >= 50 ? 'var(--secondary)' : score >= 30 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div className="match-ring-wrap">
      <svg width="64" height="64" className="match-ring-svg">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <circle
          cx="32" cy="32" r={r}
          fill="none"
          stroke={color}   /* dynamic */
          strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s var(--ease-out)' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span className="match-ring-text">{score}</span>
        <span className="match-ring-pct">%</span>
      </div>
    </div>
  );
};

/* ── Status config ── */
const STATUS = {
  applied:     { label: 'Applied',     cls: 'badge-secondary' },
  reviewing:   { label: 'Reviewing',   cls: 'badge-info' },
  interviewed: { label: 'Interviewed', cls: 'badge-primary' },
  accepted:    { label: 'Accepted',    cls: 'badge-success' },
  rejected:    { label: 'Rejected',    cls: 'badge-danger' },
};

/* ── App Card ── */
const AppCard = ({ app }) => {
  const statusCfg = STATUS[app.status] || STATUS.applied;
  const score     = app.match_score ?? 0;
  // score color is dynamic
  const scoreColor = score >= 75 ? 'var(--success)' : score >= 50 ? 'var(--secondary)' : score >= 30 ? 'var(--warning)' : 'var(--danger)';
  const fillClass  = score >= 75 ? 'progress-fill-success' : score >= 50 ? 'progress-fill-primary' : 'progress-fill-warning';

  return (
    <div className="glass-panel card-glow app-card animate-fade-up">
      <MatchRing score={score} />

      <div className="app-card-info">
        <div className="app-card-top">
          <h3 className="app-card-title">{app.job?.title ?? 'Unknown Job'}</h3>
          <span className={`badge badge-dot ${statusCfg.cls}`}>{statusCfg.label}</span>
        </div>

        <div className="app-card-meta">
          <Clock size={11} />
          Applied {new Date(app.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>

        <div className="score-bar-header">
          <span className="score-bar-label">Match Score</span>
          <span className="score-bar-value" style={{ color: scoreColor }}>{score}%</span>
        </div>
        <div className="progress-bar">
          <div className={`progress-fill ${fillClass}`} style={{ width: `${score}%` }} />
        </div>
      </div>
    </div>
  );
};

/* ── Application Tracker ── */
const ApplicationTracker = () => {
  const [applications,  setApplications] = useState([]);
  const [loading,       setLoading]      = useState(true);
  const [sortBy,        setSortBy]       = useState('date');
  const [filterStatus,  setFilterStatus] = useState('all');

  useEffect(() => {
    api.get('/applications/my-applications')
      .then(r => setApplications(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="loading-page">
      <div className="spinner" />
      <span>Loading applications…</span>
    </div>
  );

  const filtered = applications
    .filter(a => filterStatus === 'all' || a.status === filterStatus)
    .sort((a, b) =>
      sortBy === 'score'
        ? (b.match_score ?? 0) - (a.match_score ?? 0)
        : new Date(b.applied_at) - new Date(a.applied_at)
    );

  const counts = Object.fromEntries(
    Object.keys(STATUS).map(s => [s, applications.filter(a => a.status === s).length])
  );

  return (
    <div className="page-content animate-fade-in">
      <div className="container">

        {/* ── Header ── */}
        <div className="tracker-header">
          <h1 className="tracker-title">My Applications</h1>
          <p className="tracker-sub">Track every application from submission to offer.</p>
        </div>

        {/* ── Status tabs ── */}
        <div className="status-tabs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`status-tab${filterStatus === 'all' ? ' active' : ''}`}
          >
            All ({applications.length})
          </button>
          {Object.entries(STATUS).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setFilterStatus(filterStatus === key ? 'all' : key)}
              className={`status-tab${filterStatus === key ? ' active' : ''}`}
            >
              {label}{counts[key] > 0 ? ` (${counts[key]})` : ''}
            </button>
          ))}
        </div>

        {/* ── Sort bar ── */}
        <div className="sort-bar">
          <div className="sort-result-count">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</div>
          <div className="sort-buttons">
            <span className="sort-label">Sort by:</span>
            <button
              onClick={() => setSortBy('date')}
              className={`btn btn-sm ${sortBy === 'date' ? 'btn-outline' : 'btn-ghost'}`}
              style={sortBy === 'date' ? { borderColor: 'var(--primary-light)' } : {}}
            >
              <Clock size={12} /> Date
            </button>
            <button
              onClick={() => setSortBy('score')}
              className={`btn btn-sm ${sortBy === 'score' ? 'btn-outline' : 'btn-ghost'}`}
              style={sortBy === 'score' ? { borderColor: 'var(--primary-light)' } : {}}
            >
              <TrendingUp size={12} /> Match Score
            </button>
          </div>
        </div>

        {/* ── Cards ── */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><ClipboardList size={28} /></div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '0.5rem' }}>No applications yet</h3>
            <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>
              {filterStatus === 'all'
                ? 'Browse jobs and apply to get started.'
                : `No applications with status "${STATUS[filterStatus]?.label}".`}
            </p>
          </div>
        ) : (
          <div className="app-list">
            {filtered.map(app => <AppCard key={app.id} app={app} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationTracker;
