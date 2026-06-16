import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api';
import { Link } from 'react-router-dom';
import {
  UploadCloud, FileText, Briefcase, Users,
  ClipboardList, Calendar, TrendingUp, CheckCircle,
  Clock, Star, PlusCircle, ArrowRight, Eye
} from 'lucide-react';
import './Dashboard.css';

/* ────────────────── Stat Card ────────────────── */
const StatCard = ({ icon: Icon, value, label, variant = 'primary', delay = 0 }) => (
  <div className={`stat-card stat-card-${variant} animate-fade-up`} style={{ animationDelay: `${delay}ms` }}>
    <div className={`stat-icon stat-icon-${variant}`} style={{ marginBottom: '0.75rem' }}>
      <Icon size={20} />
    </div>
    <div className="stat-value">{value}</div>
    <div className="stat-label" style={{ marginTop: '4px' }}>{label}</div>
  </div>
);

/* ────────────────── Resume Upload ────────────────── */
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
    handleFile(e.dataTransfer.files[0]);
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
      <h3 className="panel-heading">
        <FileText size={18} color="var(--primary-light)" />
        My Resume
      </h3>

      {resume && (
        <div className="resume-status-ok">
          <CheckCircle size={16} color="var(--success-light)" />
          <div>
            <div className="resume-status-filename">Resume on file</div>
            <div className="resume-status-meta">{resume.file_path.split('_').pop()}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Drop zone — border/bg color are dynamic based on drag/file state */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`upload-zone${dragging ? ' dragging' : ''}${file ? ' has-file' : ''}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])}
          />
          <div className="upload-icon">
            <UploadCloud size={32} color={file ? 'var(--success-light)' : 'var(--text-3)'} />
          </div>
          {file ? (
            <>
              <div className="upload-filename">{file.name}</div>
              <div className="upload-filemeta">{(file.size / 1024).toFixed(0)} KB · Click to change</div>
            </>
          ) : (
            <>
              <div className="upload-hint-title">Drop your PDF here, or click to browse</div>
              <div className="upload-hint-sub">PDF only · Max 10 MB</div>
            </>
          )}
        </div>

        <button
          type="submit"
          className={`btn btn-primary${loading ? ' btn-loading' : ''}`}
          disabled={loading || !file}
          style={{ width: '100%' }}
        >
          {loading
            ? <><div className="btn-spinner" />Uploading…</>
            : <><UploadCloud size={16} />{resume ? 'Replace Resume' : 'Upload Resume'}</>
          }
        </button>
      </form>
    </div>
  );
};

/* ────────────────── Job Row (Recruiter) ────────────────── */
const JobRow = ({ job }) => (
  <div className="job-list-row">
    <div className="job-list-info">
      <div className="job-list-title">{job.title}</div>
      <div className="job-list-meta">
        <Clock size={12} />
        {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </div>
    </div>
    <Link to={`/job-review/${job.id}`} className="btn btn-outline btn-sm" style={{ flexShrink: 0 }}>
      <Eye size={13} /> Review
    </Link>
  </div>
);

/* ────────────────── Dashboard ────────────────── */
const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [resume, setResume] = useState(null);
  const [jobs,   setJobs]   = useState([]);

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
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-welcome-title">
              {greeting}, {user.full_name.split(' ')[0]}! 👋
            </h1>
            <p className="dashboard-welcome-sub">
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
            <div className="dash-stats-grid">
              <StatCard icon={ClipboardList} value="—"   label="Applications"    variant="primary"   delay={0}   />
              <StatCard icon={TrendingUp}    value="—%"  label="Avg Match Score"  variant="secondary" delay={100} />
              <StatCard icon={Calendar}      value="—"   label="Interviews"       variant="success"   delay={200} />
              <StatCard icon={Star}          value="—"   label="Shortlisted"      variant="warning"   delay={300} />
            </div>

            <div className="dash-panels-grid">
              <ResumeUpload resume={resume} onUpload={r => setResume(r)} />

              <div className="glass-panel animate-fade-up delay-3">
                <h3 className="panel-heading">
                  <Briefcase size={18} color="var(--secondary)" />
                  Quick Actions
                </h3>
                <div className="quick-actions-list">
                  {[
                    { to: '/jobs',         label: 'Browse Available Jobs',      icon: Briefcase     },
                    { to: '/applications', label: 'Track My Applications',      icon: ClipboardList },
                    { to: '/interviews',   label: 'View Scheduled Interviews',  icon: Calendar      },
                  ].map(({ to, label, icon: Icon }) => (
                    <Link key={to} to={to} className="quick-action-link">
                      <div className="quick-action-inner">
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
            <div className="dash-stats-grid">
              <StatCard icon={Briefcase}  value={jobs.length} label="Jobs Posted"      variant="primary"   delay={0}   />
              <StatCard icon={Users}      value="—"           label="Total Applicants"  variant="secondary" delay={100} />
              <StatCard icon={TrendingUp} value="—%"          label="Avg Match Score"   variant="success"   delay={200} />
              <StatCard icon={Calendar}   value="—"           label="Interviews Set"    variant="warning"   delay={300} />
            </div>

            <div className="dash-panels-grid">
              {/* Active Jobs */}
              <div className="glass-panel animate-fade-up delay-1">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 className="panel-heading" style={{ margin: 0 }}>
                    <Briefcase size={18} color="var(--primary-light)" />
                    Your Active Jobs
                  </h3>
                  <span className="badge badge-primary">{jobs.length}</span>
                </div>

                {jobs.length > 0 ? (
                  jobs.map(job => <JobRow key={job.id} job={job} />)
                ) : (
                  <div className="panel-empty">
                    <div className="panel-empty-icon"><Briefcase size={24} /></div>
                    <p className="panel-empty-text">No jobs posted yet. Create your first listing!</p>
                    <Link to="/post-job" className="btn btn-primary btn-sm">
                      <PlusCircle size={14} /> Post a Job
                    </Link>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="glass-panel animate-fade-up delay-2">
                <h3 className="panel-heading">
                  <TrendingUp size={18} color="var(--secondary)" />
                  Quick Actions
                </h3>

                <Link to="/post-job" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                  <PlusCircle size={16} /> Post a New Job
                </Link>

                <div className="tips-section-label">Tips to get started</div>
                {[
                  'Add detailed skill requirements for better AI matching',
                  'Post multiple roles to attract diverse candidates',
                  'Review applicants daily for fastest time-to-hire',
                ].map((tip, i) => (
                  <div key={i} className="tip-row">
                    <div className="tip-num">{i + 1}</div>
                    <span className="tip-text">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
