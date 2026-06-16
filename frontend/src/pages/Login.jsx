import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles, ArrowRight, BrainCircuit, Target, Users } from 'lucide-react';

const PERKS = [
  { icon: BrainCircuit, text: 'AI-powered resume analysis' },
  { icon: Target,       text: 'Instant match scoring' },
  { icon: Users,        text: 'Seamless pipeline tracking' },
];

const Login = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const { login } = useContext(AuthContext);
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: 'calc(100vh - 65px)',
    }}>

      {/* ── LEFT PANEL — Brand ── */}
      <div className="animate-slide-left" style={{
        display: 'none',
        flex: '0 0 45%',
        background: 'linear-gradient(145deg, rgba(124,58,237,0.18) 0%, rgba(6,182,212,0.1) 100%)',
        borderRight: '1px solid var(--border)',
        padding: '3rem',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }} className="login-left-panel">
        {/* Orb */}
        <div aria-hidden style={{
          position: 'absolute', width: '500px', height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
          top: '-100px', left: '-100px', pointerEvents: 'none',
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
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            fontWeight: 800, letterSpacing: '-0.035em', marginBottom: '1rem', lineHeight: 1.1,
          }}>
            The smarter way<br />
            <span className="text-gradient">to hire talent.</span>
          </h2>
          <p style={{ color: 'var(--text-2)', marginBottom: '2.5rem', lineHeight: 1.65 }}>
            Join thousands of companies and candidates who rely on RecruitPro to make better hiring decisions.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {PERKS.map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'var(--primary-subtle)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={16} color="var(--primary-light)" />
                </div>
                <span style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — Form ── */}
      <div className="animate-slide-right" style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Header */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800,
              letterSpacing: '-0.035em', marginBottom: '0.5rem',
            }}>
              Welcome back
            </h1>
            <p style={{ color: 'var(--text-2)', fontSize: '0.9375rem' }}>
              Sign in to your RecruitPro account
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="alert alert-error mb-4" role="alert">
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="input-group" style={{ position: 'relative' }}>
              <label htmlFor="login-email">Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none',
                }} />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="input-group">
              <label htmlFor="login-password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none',
                }} />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  autoComplete="current-password"
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
                    alignItems: 'center', padding: '4px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text-1)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="login-submit"
              className={`btn btn-primary btn-full${loading ? ' btn-loading' : ''}`}
              disabled={loading}
              style={{ marginTop: '0.5rem', padding: '0.75rem', fontSize: '1rem' }}
            >
              {loading ? (
                <>
                  <div className="btn-spinner" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider-with-text" style={{ margin: '1.75rem 0' }}>
            <span>new to recruitpro?</span>
          </div>

          {/* Register link */}
          <Link to="/register" className="btn btn-outline btn-full" style={{ justifyContent: 'center' }}>
            Create a free account
          </Link>

          <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-3)' }}>
            By signing in you agree to our{' '}
            <a href="#" style={{ color: 'var(--primary-light)' }}>Terms</a>
            {' '}and{' '}
            <a href="#" style={{ color: 'var(--primary-light)' }}>Privacy Policy</a>.
          </p>
        </div>
      </div>

      {/* Inline responsive style for left panel */}
      <style>{`
        @media (min-width: 900px) {
          .login-left-panel { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;
