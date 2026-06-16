import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Calendar, Clock, Video, ExternalLink, CheckCircle, AlertCircle, Hourglass } from 'lucide-react';
import './Interviews.css';

/* ── Countdown helper ── */
const getCountdown = (dateStr) => {
  const diff = new Date(dateStr) - Date.now();
  if (diff < 0) return null;
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0)  return `in ${days}d ${hours}h`;
  if (hours > 0) return `in ${hours}h ${minutes}m`;
  return `in ${minutes}m`;
};

/* ── Interview Card ── */
const InterviewCard = ({ interview, index }) => {
  const scheduled = new Date(interview.scheduled_at);
  const isPast    = scheduled < Date.now();
  const countdown = getCountdown(interview.scheduled_at);
  const isToday   = !isPast && new Date().toDateString() === scheduled.toDateString();
  const isSoon    = !isPast && (scheduled - Date.now()) < 3600 * 2 * 1000;

  // Dynamic colors based on timing — kept inline
  const accentColor = isPast ? 'var(--text-3)' : isToday || isSoon ? 'var(--warning)' : 'var(--secondary)';
  const badgeClass  = isPast ? '' : isToday ? 'badge-warning' : 'badge-secondary';
  const badgeLabel  = isPast ? 'Completed' : isToday ? `Today · ${countdown}` : countdown;

  return (
    <div
      className={`glass-panel card-glow interview-card${isPast ? ' past' : ''} animate-fade-up delay-${Math.min(index + 1, 5)}`}
      style={{ borderLeft: `3px solid ${accentColor}` }}
    >
      {/* Top row */}
      <div className="interview-card-top">
        <div className="interview-card-left">
          {/* Date block — background/border are dynamic per timing */}
          <div
            className="date-block"
            style={{
              background: isPast ? 'rgba(255,255,255,0.04)' : `${accentColor}18`,
              border: `1px solid ${isPast ? 'var(--border)' : `${accentColor}40`}`,
            }}
          >
            <span className="date-block-day" style={{ color: isPast ? 'var(--text-3)' : 'var(--text-1)' }}>
              {scheduled.getDate()}
            </span>
            <span className="date-block-month" style={{ color: accentColor }}>
              {scheduled.toLocaleString('en-US', { month: 'short' })}
            </span>
          </div>

          <div className="interview-info">
            <h3 className="interview-title">
              {interview.application?.job?.title || 'Technical Interview'}
            </h3>
            <div className="interview-time">
              <Clock size={12} />
              {scheduled.toLocaleString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}
            </div>
          </div>
        </div>

        {/* Countdown badge */}
        {badgeLabel && (
          <span className={`badge badge-dot ${badgeClass}`} style={{ flexShrink: 0 }}>
            {isPast ? <CheckCircle size={10} /> : isSoon ? <AlertCircle size={10} /> : <Hourglass size={10} />}
            {badgeLabel}
          </span>
        )}
      </div>

      {/* Bottom row */}
      <div className="interview-card-bottom">
        <div className="interview-meeting-info">
          <Video size={14} style={{ flexShrink: 0 }} />
          <span className="interview-meeting-url">{interview.meeting_link}</span>
        </div>

        <a
          href={interview.meeting_link}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn btn-sm ${isPast ? 'btn-outline' : 'btn-primary'}`}
          style={{ flexShrink: 0 }}
        >
          <ExternalLink size={13} />
          {isPast ? 'View Recording' : 'Join Meeting'}
        </a>
      </div>
    </div>
  );
};

/* ── Main Page ── */
const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState('all');

  useEffect(() => {
    api.get('/interviews/my-interviews')
      .then(r => setInterviews(r.data.sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="loading-page">
      <div className="spinner" />
      <span>Loading interviews…</span>
    </div>
  );

  const now      = Date.now();
  const upcoming = interviews.filter(i => new Date(i.scheduled_at) >= now);
  const past     = interviews.filter(i => new Date(i.scheduled_at) <  now);
  const displayed = filter === 'upcoming' ? upcoming : filter === 'past' ? past : interviews;

  return (
    <div className="page-content animate-fade-in">
      <div className="container">

        {/* ── Header ── */}
        <div className="interviews-header">
          <div>
            <h1 className="interviews-title">My Interviews</h1>
            <p className="interviews-sub">
              {upcoming.length} upcoming · {past.length} completed
            </p>
          </div>
        </div>

        {/* ── Stats strip ── */}
        <div className="interviews-stats-grid">
          {[
            { label: 'Upcoming',  value: upcoming.length,   icon: Calendar,    variant: 'primary' },
            { label: 'Completed', value: past.length,       icon: CheckCircle, variant: 'success' },
            { label: 'Total',     value: interviews.length, icon: Clock,       variant: 'secondary' },
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

        {/* ── Filter tabs ── */}
        <div className="interviews-tabs">
          {[
            { key: 'all',      label: `All (${interviews.length})` },
            { key: 'upcoming', label: `Upcoming (${upcoming.length})` },
            { key: 'past',     label: `Completed (${past.length})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`interviews-tab${filter === key ? ' active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Interview cards ── */}
        {displayed.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Calendar size={28} /></div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '0.5rem' }}>
              {filter === 'upcoming' ? 'No upcoming interviews' : filter === 'past' ? 'No past interviews' : 'No interviews yet'}
            </h3>
            <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>
              {filter === 'upcoming'
                ? 'Apply to jobs to get interview invitations.'
                : 'Your completed interviews will appear here.'}
            </p>
          </div>
        ) : (
          <div className="interviews-list">
            {displayed.map((interview, i) => (
              <InterviewCard key={interview.id} interview={interview} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Interviews;
