import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { Link } from 'react-router-dom';
import {
  UploadCloud, FileText, Briefcase, Users,
  ClipboardList, Calendar, TrendingUp, CheckCircle,
  Clock, Star, PlusCircle, ArrowRight, Eye
} from 'lucide-react';

/* ────────────────── Stat Card ────────────────── */
const StatCard = ({ icon: Icon, value, label, variant = 'primary', delay = 0 }) => (
  <div className={`stat-card stat-card-${variant} animate-fade-up`} style={{ animationDelay: `${delay}ms` }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <div className={`stat-icon stat-icon-${variant}`} style={{ marginBottom: '0.75rem' }}>
          <Icon size={20} />
        </div>
        <div className="stat-value">{value}</div>
        <div className="stat-label" style={{ marginTop: '4px' }}>{label}</div>
      </div>
    </div>
  </div>
);

/* ────────────────── Drag-Drop Upload ────────────────── */
const ResumeUpload = ({ resume, onUpload }) => {
  const [dragging, setDragging] = useState(false);
  const [file,     setFile]     = useState(null);
  const [loading,  setLoading]  = useState(false);
  const inputRef               = useRef();

  const handleFile = (f) => {
    if (f && f.type === 'application/pdf') setFile(f);
    else alert('Please select a PDF file.');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    handleFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await api.post('/resumes/', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUpload(res.data);
      setFile(null);
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.detail || ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel animate-fade-up delay-2" style={{ padding: '2rem' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
        <FileText size={18} color="var(--primary-light)" />
        My Resume
      </h3>

      {resume && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '12px 16px', borderRadius: 'var(--radius-md)',
          background: 'var(--success-subtle)', border: '1px solid var(--success-border)',
          marginBottom: '1.25rem',
        }}>
          <CheckCircle size={16} color="var(--success-light)" />
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--success-light)' }}>Resume on file</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '2px' }}>
              {resume.file_path.split('_').pop()}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragging ? 'var(--primary-light)' : file ? 'var(--success)' : 'var(--border-medium)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: dragging ? 'var(--primary-subtle)' : file ? 'var(--success-subtle)' : 'transparent',
            marginBottom: '1rem',
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])}
          />
          <UploadCloud size={32} color={file ? 'var(--success-light)' : 'var(--text-3)'} style={{ marginBottom: '0.75rem' }} />
          {file ? (
            <>
              <div style={{ fontWeight: 600, color: 'var(--success-light)', fontSize: '0.9rem', marginBottom: '4px' }}>
                {file.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
                {(file.size / 1024).toFixed(0)} KB · Click to change
              </div>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 600, color: 'var(--text-2)', fontSize: '0.9rem', marginBottom: '4px' }}>
                Drop your PDF here, or click to browse
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>PDF only · Max 10 MB</div>
            </>
          )}
        </div>

        <button
          type="submit"
          className={`btn btn-primary${loading ? ' btn-loading' : ''}`}
          disabled={loading || !file}
          style={{ width: '100%' }}
        >
          {loading ? <><div className="btn-spinner" />Uploading…</> : <><UploadCloud size={16} />{resume ? 'Replace Resume' : 'Upload Resume'}</>}
        </button>
      </form>
    </div>
  );
};

/* ────────────────── Job Row ────────────────── */
const JobRow = ({ job }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1rem 0', borderBottom: '1px solid var(--border)', gap: '1rem',
  }}>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontWeight: 600, color: 'var(--text-1)', fontSize: '0.9375rem', marginBottom: '3px' }} className="truncate">
        {job.title}
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <Clock size={12} />
        {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </div>
    </div>
    <Link
      to={`/job-review/${job.id}`}
      className="btn btn-outline btn-sm"
      style={{ flexShrink: 0 }}
    >
      <Eye size={13} /> Review
    </Link>
  </div>
);

/* ────────────────── Dashboard ────────────────── */
const Dashboard = () => {
  const { user }  = useContext(AuthContext);
  const [resume,  setResume]  = useState(null);
  const [jobs,    setJobs]    = useState([]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    if (user?.role === 'candidate') {
      api.get('/resumes/me').then(r => setResume(r.data)).catch(() => {});
    } else if (user?.role === 'recruiter') {
      api.get('/jobs/').then(r => {
        setJobs(r.data.filter(j => j.recruiter_id === user.id));
      }).catch(() => {});
    }
  }, [user]);

  if (!user) return (
    <div className="loading-page">
      <div className="spinner" />
      <span>Loading dashboard…</span>
    </div>
  );

  return (
    <div className="page-content animate-fade-in">
      <div className="container">

        {/* ── Welcome Banner ── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem',
        }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.035em', marginBottom: '0.375rem' }}>
              {greeting}, {user.full_name.split(' ')[0]}! 👋
            </h1>
            <p style={{ color: 'var(--text-2)', fontSize: '0.9375rem' }}>
              Here's what's happening with your{' '}
              <span className="badge badge-primary" style={{ textTransform: 'capitalize', fontSize: '0.75rem' }}>
                {user.role}
              </span>
              {' '}account.
            </p>
          </div>
          {user.role === 'recruiter' && (
            <Link to="/post-job" className="btn btn-primary">
              <PlusCircle size={16} /> Post a Job
            </Link>
          )}
          {user.role === 'candidate' && (
            <Link to="/jobs" className="btn btn-primary">
              <Briefcase size={16} /> Browse Jobs
            </Link>
          )}
        </div>

        {/* ── CANDIDATE VIEW ── */}
        {user.role === 'candidate' && (
          <>
            {/* Stats */}
            <div className="grid grid-4 animate-fade-up" style={{ marginBottom: '2rem', gap: '1rem' }}>
              <StatCard icon={ClipboardList} value="—"     label="Applications"   variant="primary"   delay={0}   />
              <StatCard icon={TrendingUp}    value="—%"    label="Avg Match Score" variant="secondary" delay={100} />
              <StatCard icon={Calendar}      value="—"     label="Interviews"      variant="success"   delay={200} />
              <StatCard icon={Star}          value="—"     label="Shortlisted"     variant="warning"   delay={300} />
            </div>

            {/* Panels */}
            <div className="grid grid-2" style={{ gap: '1.5rem' }}>
              <ResumeUpload resume={resume} onUpload={r => setResume(r)} />

              <div className="glass-panel animate-fade-up delay-3">
                <h3 style={{ fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                  <Briefcase size={18} color="var(--secondary)" />
                  Quick Actions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { to: '/jobs',         label: 'Browse Available Jobs',    icon: Briefcase },
                    { to: '/applications', label: 'Track My Applications',    icon: ClipboardList },
                    { to: '/interviews',   label: 'View Scheduled Interviews', icon: Calendar },
                  ].map(({ to, label, icon: Icon }) => (
                    <Link key={to} to={to} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.875rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      background: 'rgba(255,255,255,0.02)',
                      color: 'var(--text-2)',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      fontSize: '0.9rem', fontWeight: 500,
                    }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)';
                        e.currentTarget.style.background  = 'var(--primary-subtle)';
                        e.currentTarget.style.color       = 'var(--text-1)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.background  = 'rgba(255,255,255,0.02)';
                        e.currentTarget.style.color       = 'var(--text-2)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon size={16} />
                        {label}
                      </div>
                      <ArrowRight size={14} style={{ opacity: 0.5 }} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── RECRUITER VIEW ── */}
        {user.role === 'recruiter' && (
          <>
            {/* Stats */}
            <div className="grid grid-4" style={{ marginBottom: '2rem', gap: '1rem' }}>
              <StatCard icon={Briefcase}    value={jobs.length} label="Jobs Posted"     variant="primary"   delay={0}   />
              <StatCard icon={Users}        value="—"           label="Total Applicants" variant="secondary" delay={100} />
              <StatCard icon={TrendingUp}   value="—%"          label="Avg Match Score"  variant="success"   delay={200} />
              <StatCard icon={Calendar}     value="—"           label="Interviews Set"   variant="warning"   delay={300} />
            </div>

            {/* Content grid */}
            <div className="grid grid-2" style={{ gap: '1.5rem' }}>

              {/* Active Jobs */}
              <div className="glass-panel animate-fade-up delay-1">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <Briefcase size={18} color="var(--primary-light)" />
                    Your Active Jobs
                  </h3>
                  <span className="badge badge-primary">{jobs.length}</span>
                </div>

                {jobs.length > 0 ? (
                  <div>
                    {jobs.map(job => <JobRow key={job.id} job={job} />)}
                  </div>
                ) : (
                  <div className="empty-state" style={{ padding: '2rem' }}>
                    <div className="empty-icon"><Briefcase size={24} /></div>
                    <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', textAlign: 'center' }}>No jobs posted yet. Create your first listing!</p>
                    <Link to="/post-job" className="btn btn-primary btn-sm">
                      <PlusCircle size={14} /> Post a Job
                    </Link>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="glass-panel animate-fade-up delay-2">
                <h3 style={{ fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                  <TrendingUp size={18} color="var(--secondary)" />
                  Quick Actions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { to: '/post-job', label: 'Post a New Job', icon: PlusCircle, primary: true },
                  ].map(({ to, label, icon: Icon, primary }) => (
                    <Link key={to} to={to} className={`btn ${primary ? 'btn-primary' : 'btn-outline'}`} style={{ justifyContent: 'flex-start' }}>
                      <Icon size={16} /> {label}
                    </Link>
                  ))}
                </div>

                {/* Getting started tips */}
                <div style={{ marginTop: '2rem' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.05em', marginBottom: '1rem', textTransform: 'uppercase' }}>
                    Tips to get started
                  </div>
                  {[
                    'Add detailed skill requirements for better AI matching',
                    'Post multiple roles to attract diverse candidates',
                    'Review applicants daily for fastest time-to-hire',
                  ].map((tip, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                        background: 'var(--primary-subtle)', color: 'var(--primary-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.65rem', fontWeight: 700, fontFamily: 'var(--font-display)',
                        marginTop: '1px',
                      }}>
                        {i + 1}
                      </div>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.5 }}>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
