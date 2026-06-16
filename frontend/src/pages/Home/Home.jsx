import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Target, Users, Zap, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import './Home.css';

const STATS = [
  { value: '10K+', label: 'Candidates Screened' },
  { value: '98%',  label: 'Match Accuracy' },
  { value: '3x',   label: 'Faster Hiring' },
  { value: '500+', label: 'Companies Hiring' },
];

const FEATURES = [
  {
    icon: BrainCircuit,
    title: 'AI Resume Parsing',
    desc: 'Automatically extract skills, experience, and qualifications with industry-leading NLP accuracy.',
    color: 'var(--primary-light)',
    bg: 'var(--primary-subtle)',
  },
  {
    icon: Target,
    title: 'Instant Match Score',
    desc: 'Candidates receive a real-time match percentage against job requirements the moment they apply.',
    color: 'var(--secondary)',
    bg: 'var(--secondary-subtle)',
  },
  {
    icon: Users,
    title: 'Seamless Tracking',
    desc: 'From application to offer, manage your entire hiring pipeline in one stunning dashboard.',
    color: 'var(--success-light)',
    bg: 'var(--success-subtle)',
  },
];

const STEPS = [
  { num: '01', title: 'Post Your Job', desc: 'Describe the role and specify required skills. Goes live instantly.' },
  { num: '02', title: 'Candidates Apply', desc: 'Applicants upload resumes and apply with one click.' },
  { num: '03', title: 'AI Ranks Them', desc: 'Our model scores each candidate by skill match — no bias, pure signal.' },
];

const Home = () => {
  return (
    <main className="home-page page-content animate-fade-up">

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-orbs" aria-hidden>
          <div className="hero-orb-1" />
          <div className="hero-orb-2" />
        </div>

        <div className="container">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-icon">
                <Zap size={11} color="white" fill="white" />
              </span>
              AI-Powered Recruiting Platform
            </div>

            <h1 className="hero-headline">
              Hire smarter.<br />
              <span className="text-gradient">Match faster.</span>
            </h1>

            <p className="hero-sub">
              AI-powered skill extraction, deep resume analysis, and automated interview scheduling — all in one platform your team will love.
            </p>

            <div className="hero-cta-row">
              <Link to="/register" className="btn btn-primary btn-xl">
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-outline btn-xl">
                Sign In
              </Link>
            </div>

            <div className="hero-trust">
              <Shield size={13} />
              No credit card required · GDPR compliant · Free for candidates
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="stats-strip">
        <div className="container">
          <div className="stats-grid">
            {STATS.map(({ value, label }, i) => (
              <div key={label} className={`animate-fade-up delay-${i + 1}`}>
                <div className="stat-item-value">{value}</div>
                <div className="stat-item-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-heading">Everything you need to hire brilliantly</h2>
            <p className="section-sub">
              Purpose-built tools that remove friction and surface the candidates who will actually succeed.
            </p>
          </div>

          <div className="grid grid-3 features-grid">
            {FEATURES.map(({ icon: Icon, title, desc, color, bg }, i) => (
              <div key={title} className={`glass-panel card-glow feature-card animate-fade-up delay-${i + 1}`}>
                {/* bg and color are data-driven — kept inline */}
                <div className="feature-icon-wrap" style={{ background: bg, color }}>
                  <Icon size={28} />
                </div>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="steps-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-heading">Up and running in minutes</h2>
            <p className="section-sub">No complex setup, no lengthy onboarding. Just post, apply, and hire.</p>
          </div>

          <div className="steps-grid">
            {STEPS.map(({ num, title, desc }, i) => (
              <div key={num} className={`step-card animate-fade-up delay-${i + 1}`}>
                <div className="step-watermark" aria-hidden>{num}</div>
                <div className="step-badge">{num}</div>
                <h3 className="step-title">{title}</h3>
                <p className="step-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-ambient" aria-hidden />
            <div className="cta-inner">
              <h2 className="cta-heading">Ready to transform your hiring?</h2>
              <p className="cta-sub">
                Join hundreds of companies already using RecruitPro to find exceptional talent.
              </p>
              <div className="cta-actions">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Start for Free <ArrowRight size={16} />
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
              </div>
              <div className="cta-trust-list">
                {['No credit card', 'Cancel anytime', 'GDPR compliant'].map(t => (
                  <span key={t} className="cta-trust-item">
                    <CheckCircle size={13} color="var(--success-light)" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
