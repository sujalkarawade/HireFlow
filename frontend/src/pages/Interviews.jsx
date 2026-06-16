import React, { useState, useEffect } from 'react';
import api from '../api';
import { Calendar, Clock, Video, ExternalLink, CheckCircle, AlertCircle, Hourglass } from 'lucide-react';

/* ── Countdown helper ── */
const getCountdown = (dateStr) => {
  const diff = new Date(dateStr) - Date.now();
  if (diff < 0) return null; // past
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0)   return `in ${days}d ${hours}h`;
  if (hours > 0)  return `in ${hours}h ${minutes}m`;
  return `in ${minutes}m`;
};

/* ── Interview Card ── */
const InterviewCard = ({ interview, index }) => {
  const scheduled   = new Date(interview.scheduled_at);
  const isPast      = scheduled < Date.now();
  const countdown   = getCountdown(interview.scheduled_at);
  const isToday     = !isPast && (new Date().toDateString() === scheduled.toDateString());
  const isSoon      = !isPast && countdown?.startsWith('in') && (scheduled - Date.now()) < 3600 * 2 * 1000; // within 2h

  const accentColor  = isPast ? 'var(--text-3)' : isToday || isSoon ? 'var(--warning)' : 'var(--secondary)';
  const badgeClass   = isPast ? '' : isToday ? 'badge-warning' : 'badge-secondary';
  const badgeLabel   = isPast ? 'Completed' : isToday ? `Today · ${countdown}` : countdown;

  return (
    <div className={`glass-panel card-glow animate-fade-up delay-${Math.min(index + 1, 5)}`} style={{
      padding: '1.5rem',
      borderLeft: `3px solid ${accentColor}`,
      opacity: isPast ? 0.7 : 1,
      transition: 'opacity 0.2s',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Date block */}
          <div style={{
            width: '52px', height: '56px', borderRadius: '12px',
            background: isPast ? 'rgba(255,255,255,0.04)' : `${accentColor}18`,
            border: `1px solid ${isPast ? 'var(--border)' : `${accentColor}40`}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.125rem',
              color: isPast ? 'var(--text-3)' : 'var(--text-1)', lineHeight: 1,
            }}>
              {scheduled.getDate()}
            </div>
            <div style={{
              fontSize: '0.65rem', fontWeight: 600, color: accentColor, letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              {scheduled.toLocaleString('en-US', { month: 'short' })}
            </div>
          </div>

          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>
              {interview.application?.job?.title || 'Technical Interview'}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-3)', fontSize: '0.8125rem' }}>
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

      {/* Info row */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
        gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-2)', fontSize: '0.875rem', minWidth: 0 }}>
          <Video size={14} style={{ flexShrink: 0 }} />
          <span className="truncate">{interview.meeting_link}</span>
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
  const [filter,     setFilter]     = useState('all'); // 'all' | 'upcoming' | 'past'

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await api.get('/interviews/my-interviews');
        setInterviews(res.data.sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  if (loading) return (
    <div className="loading-page">
      <div className="spinner" />
      <span>Loading interviews…</span>
    </div>
  );

  const now       = Date.now();
  const upcoming  = interviews.filter(i => new Date(i.scheduled_at) >= now);
  const past      = interviews.filter(i => new Date(i.scheduled_at) <  now);

  const displayed = filter === 'upcoming' ? upcoming : filter === 'past' ? past : interviews;

  return (
    <div className="page-content animate-fade-in">
      <div className="container">

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.035em', marginBottom: '0.5rem' }}>
              My Interviews
            </h1>
            <p style={{ color: 'var(--text-2)' }}>
              {upcoming.length} upcoming · {past.length} completed
            </p>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-3" style={{ gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Upcoming',  value: upcoming.length, icon: Calendar,    variant: 'primary' },
            { label: 'Completed', value: past.length,     icon: CheckCircle, variant: 'success' },
            { label: 'Total',     value: interviews.length,icon: Clock,      variant: 'secondary' },
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
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
          {[
            { key: 'all',      label: `All (${interviews.length})` },
            { key: 'upcoming', label: `Upcoming (${upcoming.length})` },
            { key: 'past',     label: `Completed (${past.length})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: '6px 14px', borderRadius: '9999px', fontSize: '0.8125rem',
                fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                border: `1px solid ${filter === key ? 'var(--primary-light)' : 'var(--border-medium)'}`,
                background: filter === key ? 'var(--primary-subtle)' : 'transparent',
                color: filter === key ? '#c4b5fd' : 'var(--text-2)',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Interview Cards ── */}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
