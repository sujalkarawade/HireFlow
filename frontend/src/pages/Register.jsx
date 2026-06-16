import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, Sparkles, ArrowRight, Briefcase, UserCircle, CheckCircle } from 'lucide-react';

const getPasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 8)        score++;
  if (/[A-Z]/.test(pwd))      score++;
  if (/[0-9]/.test(pwd))      score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const levels = [
    { label: '',        color: 'transparent' },
    { label: 'Weak',    color: 'var(--danger)' },
    { label: 'Fair',    color: 'var(--warning)' },
    { label: 'Good',    color: 'var(--secondary)' },
    { label: 'Strong',  color: 'var(--success)' },
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
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)' }}>

      {/* ── LEFT PANEL ── */}
      <div className="login-left-panel animate-slide-left" style={{
        display: 'none', flex: '0 0 42%',
        background: 'linear-gradient(145deg, rgba(6,182,212,0.12) 0%, rgba(124,58,237,0.14) 100%)',
        borderRight: '1px solid var(--border)',
        padding: '3rem', flexDirection: 'column', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden style={{
          position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
          bottom: '-120px', right: '-100px', pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3rem' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: 'linear-gradient(135deg,var(--primary),var(--primary-dim))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-primary-sm)',
            }}>
              <Sparkles size={18} color="white" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.35rem', letterSpacing: '-0.04em' }}>
              RecruitPro
            </span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.4rem)',
            fontWeight: 800, letterSpacing: '-0.035em', marginBottom: '1rem', lineHeight: 1.1,
          }}>
            Your next great hire<br />
            <span className="text-gradient">starts here.</span>
          </h2>
          <p style={{ color: 'var(--text-2)', marginBottom: '2.5rem', lineHeight: 1.65 }}>
            Free to join. Powerful from day one. Whether you're hiring or job hunting, RecruitPro has you covered.
          </p>
          {['Free to get started', 'AI match in seconds', 'No ads, ever'].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.875rem' }}>
              <CheckCircle size={16} color="var(--success-light)" />
              <span style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL — Form ── */}
      <div className="animate-slide-right" style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>

          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.035em', marginBottom: '0.5rem' }}>
              Create your account
            </h1>
            <p style={{ color: 'var(--text-2)', fontSize: '0.9375rem' }}>
              Join RecruitPro in under a minute
            </p>
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
              <div style={{ position: 'relative' }}>
                <User size={16} style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none',
                }} />
                <input
                  id="reg-name"
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  required
                  autoComplete="name"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            {/* Email */}
            <div className="input-group">
              <label htmlFor="reg-email">Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none',
                }} />
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            {/* Password + strength */}
            <div className="input-group">
              <label htmlFor="reg-password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none',
                }} />
                <input
                  id="reg-password"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                  autoComplete="new-password"
                  style={{ paddingLeft: '2.75rem', paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none', border: 'none',
                    cursor: 'pointer', color: 'var(--text-3)', display: 'flex',
                    alignItems: 'center', padding: '4px', transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text-1)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Strength meter */}
              {formData.password && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{
                        flex: 1, height: '3px', borderRadius: '9999px',
                        background: i <= strength.score ? strength.color : 'rgba(255,255,255,0.08)',
                        transition: 'background 0.3s',
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: strength.color, fontWeight: 500 }}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Role selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block', fontFamily: 'var(--font-display)', fontSize: '0.8125rem',
                fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.625rem',
              }}>
                I am joining as…
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { value: 'candidate', label: 'Candidate', sub: 'Looking for jobs', icon: UserCircle },
                  { value: 'recruiter', label: 'Recruiter',  sub: 'Hiring talent', icon: Briefcase },
                ].map(({ value, label, sub, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData(f => ({ ...f, role: value }))}
                    style={{
                      padding: '1rem',
                      border: `2px solid ${formData.role === value ? 'var(--primary-light)' : 'var(--border-medium)'}`,
                      borderRadius: 'var(--radius-lg)',
                      background: formData.role === value ? 'var(--primary-subtle)' : 'var(--bg-input)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      boxShadow: formData.role === value ? '0 0 0 3px var(--primary-glow)' : 'none',
                    }}
                  >
                    <Icon
                      size={20}
                      color={formData.role === value ? 'var(--primary-light)' : 'var(--text-3)'}
                      style={{ marginBottom: '6px' }}
                    />
                    <div style={{
                      fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem',
                      color: formData.role === value ? 'var(--text-1)' : 'var(--text-2)',
                      marginBottom: '2px',
                    }}>
                      {label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              id="register-submit"
              className={`btn btn-primary btn-full${loading ? ' btn-loading' : ''}`}
              disabled={loading}
              style={{ padding: '0.75rem', fontSize: '1rem' }}
            >
              {loading ? (
                <>
                  <div className="btn-spinner" />
                  Creating account…
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="divider-with-text" style={{ margin: '1.75rem 0' }}>
            <span>already have an account?</span>
          </div>

          <Link to="/login" className="btn btn-outline btn-full" style={{ justifyContent: 'center' }}>
            Sign in instead
          </Link>

          <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-3)' }}>
            By creating an account you agree to our{' '}
            <a href="#" style={{ color: 'var(--primary-light)' }}>Terms</a>
            {' '}and{' '}
            <a href="#" style={{ color: 'var(--primary-light)' }}>Privacy Policy</a>.
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .login-left-panel { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default Register;
