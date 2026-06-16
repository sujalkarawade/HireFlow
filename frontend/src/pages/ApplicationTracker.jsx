import React, { useState, useEffect } from 'react';
import api from '../api';
import { ClipboardList, Clock, TrendingUp, CheckCircle, X, Eye, ChevronDown, ChevronUp } from 'lucide-react';

/* ── Match Score Ring SVG ── */
const MatchRing = ({ score }) => {
  const r   = 26;
  const circ = 2 * Math.PI * r;
  const pct  = Math.min(Math.max(score, 0), 100) / 100;
  const dash = circ * pct;
  const color = score >= 75 ? 'var(--success)' : score >= 50 ? 'var(--secondary)' : score >= 30 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}>
      <svg width="64" height="64" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <circle
          cx="32" cy="32" r={r}
          fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s var(--ease-out)' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-1)', lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontSize: '0.55rem', color: 'var(--text-3)', fontWeight: 500 }}>%</span>
      </div>
    </div>
  );
};

/* ── Status config ── */
const STATUS = {
  applied:    { label: 'Applied',    variant: 'badge-secondary', dot: 'var(--secondary)' },
  reviewing:  { label: 'Reviewing',  variant: 'badge-info',      dot: 'var(--info)' },
  interviewed:{ label: 'Interviewed',variant: 'badge-primary',   dot: 'var(--primary-light)' },
  accepted:   { label: 'Accepted',   variant: 'badge-success',   dot: 'var(--success)' },
  rejected:   { label: 'Rejected',   variant: 'badge-danger',    dot: 'var(--danger)' },
};

/* ── App Card ── */
const AppCard = ({ app }) => {
  const status = STATUS[app.status] || STATUS.applied;
  const score  = app.match_score ?? 0;
  const scoreColor = score >= 75 ? 'var(--success)' : score >= 50 ? 'var(--secondary)' : score >= 30 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div className="glass-panel card-glow animate-fade-up" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      {/* Match ring */}
      <MatchRing score={score} />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.375rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, margin: 0 }} className="truncate">
            {app.job?.title ?? 'Unknown Job'}
          </h3>
          <span className={`badge badge-dot ${status.variant}`}>
            {status.label}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-3)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
          <Clock size={11} />
          Applied {new Date(app.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>

        {/* Score bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.75rem', color: 'var(--text-3)' }}>
            <span>Match Score</span>
            <span style={{ color: scoreColor, fontWeight: 600 }}>{score}%</span>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-fill ${score >= 75 ? 'progress-fill-success' : score >= 50 ? 'progress-fill-primary' : 'progress-fill-warning'}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Application Tracker ── */
const ApplicationTracker = () => {
  const [applications, setApplications] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [sortBy,       setSortBy]       = useState('date'); // 'date' | 'score'
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get('/applications/my-applications');
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
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

  const statusCounts = Object.fromEntries(
    Object.keys(STATUS).map(s => [s, applications.filter(a => a.status === s).length])
  );

  return (
    <div className="page-content animate-fade-in">
      <div className="container">

        {/* ── Header ── */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.035em', marginBottom: '0.5rem' }}>
            My Applications
          </h1>
          <p style={{ color: 'var(--text-2)' }}>
            Track every application from submission to offer.
          </p>
        </div>

        {/* ── Pipeline Status Tabs ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2rem' }}>
          <button
            onClick={() => setFilterStatus('all')}
            style={{
              padding: '6px 14px', borderRadius: '9999px', fontSize: '0.8125rem',
              fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              border: `1px solid ${filterStatus === 'all' ? 'var(--primary-light)' : 'var(--border-medium)'}`,
              background: filterStatus === 'all' ? 'var(--primary-subtle)' : 'transparent',
              color: filterStatus === 'all' ? '#c4b5fd' : 'var(--text-2)',
            }}
          >
            All <span style={{ opacity: 0.7 }}>({applications.length})</span>
          </button>
          {Object.entries(STATUS).map(([key, { label, variant }]) => (
            <button
              key={key}
              onClick={() => setFilterStatus(filterStatus === key ? 'all' : key)}
              style={{
                padding: '6px 14px', borderRadius: '9999px', fontSize: '0.8125rem',
                fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                border: `1px solid ${filterStatus === key ? 'var(--primary-light)' : 'var(--border)'}`,
                background: filterStatus === key ? 'var(--primary-subtle)' : 'rgba(255,255,255,0.02)',
                color: filterStatus === key ? '#c4b5fd' : 'var(--text-2)',
              }}
            >
              {label}
              {statusCounts[key] > 0 && (
                <span style={{ marginLeft: '4px', opacity: 0.7 }}>({statusCounts[key]})</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Sort controls ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-3)' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-3)' }}>Sort by:</span>
            <button
              onClick={() => setSortBy('date')}
              className={`btn btn-sm ${sortBy === 'date' ? 'btn-outline' : 'btn-ghost'}`}
              style={{ borderColor: sortBy === 'date' ? 'var(--primary-light)' : undefined }}
            >
              <Clock size={12} /> Date
            </button>
            <button
              onClick={() => setSortBy('score')}
              className={`btn btn-sm ${sortBy === 'score' ? 'btn-outline' : 'btn-ghost'}`}
              style={{ borderColor: sortBy === 'score' ? 'var(--primary-light)' : undefined }}
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
              {filterStatus === 'all' ? "Browse jobs and apply to get started." : `No applications with status "${STATUS[filterStatus]?.label}".`}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map(app => <AppCard key={app.id} app={app} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationTracker;
