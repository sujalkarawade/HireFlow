import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles, ArrowRight, BrainCircuit, Target, Users } from 'lucide-react';
import './Login.css';

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
    <div className="login-page">

      {/* ── LEFT BRAND PANEL ── */}
      <div className="login-left-panel animate-slide-left">
        <div className="login-brand-orb" aria-hidden />
        <div className="login-brand-content">

          <div className="login-brand-logo">
            <div className="login-brand-logo-icon">
              <Sparkles size={18} color="white" />
            </div>
            <span className="login-brand-name">RecruitPro</span>
          </div>

          <h2 className="login-brand-headline">
            The smarter way<br />
            <span className="text-gradient">to hire talent.</span>
          </h2>
          <p className="login-brand-sub">
            Join thousands of companies and candidates who rely on RecruitPro to make better hiring decisions.
          </p>

          <div className="login-perks">
            {PERKS.map(({ icon: Icon, text }) => (
              <div key={text} className="login-perk">
                <div className="login-perk-icon"><Icon size={16} /></div>
                <span className="login-perk-text">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="login-form-panel animate-slide-right">
        <div className="login-form-wrap">

          <div className="login-form-header">
            <h1 className="login-form-title">Welcome back</h1>
            <p className="login-form-sub">Sign in to your RecruitPro account</p>
          </div>

          {error && (
            <div className="alert alert-error mb-4" role="alert">
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="input-group">
              <label htmlFor="login-email">Email address</label>
              <div className="input-icon-wrap">
                <span className="input-icon"><Mail size={16} /></span>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="input-with-icon"
                />
              </div>
            </div>

            {/* Password */}
            <div className="input-group">
              <label htmlFor="login-password">Password</label>
              <div className="input-icon-wrap">
                <span className="input-icon"><Lock size={16} /></span>
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  autoComplete="current-password"
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
            </div>

            <button
              type="submit"
              id="login-submit"
              className={`btn btn-primary btn-full form-submit-btn${loading ? ' btn-loading' : ''}`}
              disabled={loading}
            >
              {loading
                ? <><div className="btn-spinner" />Signing in…</>
                : <>Sign In <ArrowRight size={16} /></>
              }
            </button>
          </form>

          <div className="divider-with-text auth-divider">
            <span>new to recruitpro?</span>
          </div>

          <Link to="/register" className="btn btn-outline btn-full" style={{ justifyContent: 'center' }}>
            Create a free account
          </Link>

          <p className="auth-footer-note">
            By signing in you agree to our{' '}
            <a href="#" className="auth-footer-link">Terms</a>
            {' '}and{' '}
            <a href="#" className="auth-footer-link">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
