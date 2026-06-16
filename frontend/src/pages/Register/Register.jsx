import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, Sparkles, ArrowRight, Briefcase, UserCircle, CheckCircle } from 'lucide-react';
import './Register.css';

const getPasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 8)              score++;
  if (/[A-Z]/.test(pwd))            score++;
  if (/[0-9]/.test(pwd))            score++;
  if (/[^A-Za-z0-9]/.test(pwd))    score++;
  const levels = [
    { label: '',       color: 'transparent' },
    { label: 'Weak',   color: 'var(--danger)' },
    { label: 'Fair',   color: 'var(--warning)' },
    { label: 'Good',   color: 'var(--secondary)' },
    { label: 'Strong', color: 'var(--success)' },
  ];
  return { score, ...levels[score] };
};

const Register = () => {
  const [formData, setFormData] = useState({
    email: '', password: '', full_name: '', role: 'candidate',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const { register } = useContext(AuthContext);
  const navigate     = useNavigate();

  const handleChange = (e) =>
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <div className="register-page">

      {/* ── LEFT BRAND PANEL ── */}
      <div className="register-left-panel animate-slide-left">
        <div className="register-brand-orb" aria-hidden />
        <div className="register-brand-content">

          <div className="register-brand-logo">
            <div className="register-brand-logo-icon">
              <Sparkles size={18} color="white" />
            </div>
            <span className="register-brand-name">RecruitPro</span>
          </div>

          <h2 className="register-brand-headline">
            Your next great hire<br />
            <span className="text-gradient">starts here.</span>
          </h2>
          <p className="register-brand-sub">
            Free to join. Powerful from day one. Whether you're hiring or job hunting, RecruitPro has you covered.
          </p>

          <div className="register-perks">
            {['Free to get started', 'AI match in seconds', 'No ads, ever'].map(t => (
              <div key={t} className="register-perk">
                <CheckCircle size={16} color="var(--success-light)" />
                <span className="register-perk-text">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="register-form-panel animate-slide-right">
        <div className="register-form-wrap">

          <div className="register-form-header">
            <h1 className="register-form-title">Create your account</h1>
            <p className="register-form-sub">Join RecruitPro in under a minute</p>
          </div>

          {error && (
            <div className="alert alert-error mb-4" role="alert">
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="input-group">
              <label htmlFor="reg-name">Full Name</label>
              <div className="input-icon-wrap">
                <span className="input-icon"><User size={16} /></span>
                <input
                  id="reg-name"
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  required
                  autoComplete="name"
                  className="input-with-icon"
                />
              </div>
            </div>

            {/* Email */}
            <div className="input-group">
              <label htmlFor="reg-email">Email address</label>
              <div className="input-icon-wrap">
                <span className="input-icon"><Mail size={16} /></span>
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="input-with-icon"
                />
              </div>
            </div>

            {/* Password + strength */}
            <div className="input-group">
              <label htmlFor="reg-password">Password</label>
              <div className="input-icon-wrap">
                <span className="input-icon"><Lock size={16} /></span>
                <input
                  id="reg-password"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                  autoComplete="new-password"
                  className="input-with-icon input-with-icon-right"
                />
                <button
                  type="button"
                  className="toggle-pass-btn"
                  onClick={() => setShowPass(s => !s)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Strength meter — colors are dynamic per score */}
              {formData.password && (
                <div>
                  <div className="strength-bars">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className="strength-bar"
                        style={{
                          background: i <= strength.score
                            ? strength.color
                            : 'rgba(255,255,255,0.08)',
                        }}
                      />
                    ))}
                  </div>
                  <span className="strength-label" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Role selector */}
            <div>
              <label className="role-selector-label">I am joining as…</label>
              <div className="role-selector-grid">
                {[
                  { value: 'candidate', label: 'Candidate', sub: 'Looking for jobs', icon: UserCircle },
                  { value: 'recruiter', label: 'Recruiter',  sub: 'Hiring talent',   icon: Briefcase },
                ].map(({ value, label, sub, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData(f => ({ ...f, role: value }))}
                    className={`role-card${formData.role === value ? ' active' : ''}`}
                  >
                    <Icon
                      size={20}
                      className="role-card-icon"
                      color={formData.role === value ? 'var(--primary-light)' : 'var(--text-3)'}
                    />
                    <span className="role-card-title">{label}</span>
                    <span className="role-card-sub">{sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              id="register-submit"
              className={`btn btn-primary btn-full form-submit-btn${loading ? ' btn-loading' : ''}`}
              disabled={loading}
            >
              {loading
                ? <><div className="btn-spinner" />Creating account…</>
                : <>Create Account <ArrowRight size={16} /></>
              }
            </button>
          </form>

          <div className="divider-with-text auth-divider">
            <span>already have an account?</span>
          </div>

          <Link to="/login" className="btn btn-outline btn-full" style={{ justifyContent: 'center' }}>
            Sign in instead
          </Link>

          <p className="auth-footer-note">
            By creating an account you agree to our{' '}
            <a href="#" className="auth-footer-link">Terms</a>
            {' '}and{' '}
            <a href="#" className="auth-footer-link">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
