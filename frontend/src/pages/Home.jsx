import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Target, Users, Zap, Shield, BarChart3, ArrowRight, CheckCircle } from 'lucide-react';

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
    <main className="page-content animate-fade-up" style={{ paddingTop: 0, paddingBottom: 0 }}>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(5rem, 12vw, 9rem) 0 clamp(4rem, 8vw, 7rem)',
        textAlign: 'center',
      }}>
        {/* Ambient orbs */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        }}>
          <div style={{
            position: 'absolute', width: '700px', height: '700px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
            top: '-200px', left: '50%', transform: 'translateX(-50%)',
            animation: 'orb-float 12s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', width: '400px', height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
            bottom: '-100px', right: '10%',
            animation: 'orb-float 16s ease-in-out infinite reverse',
          }} />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Eyebrow badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px 6px 10px',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '9999px',
            background: 'rgba(124,58,237,0.08)',
            fontSize: '0.8125rem', fontWeight: 600, color: '#c4b5fd',
            marginBottom: '2rem',
            animation: 'fadeUp 0.5s var(--ease-out) both',
          }}>
            <span style={{
              background: 'linear-gradient(135deg,var(--primary-light),var(--secondary))',
              borderRadius: '50%', width: '20px', height: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={11} color="white" fill="white" />
            </span>
            AI-Powered Recruiting Platform
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.75rem, 7vw, 5.25rem)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            color: 'var(--text-1)',
            marginBottom: '1.5rem',
            animation: 'fadeUp 0.6s 0.1s var(--ease-out) both',
          }}>
            Hire smarter.<br />
            <span className="text-gradient">Match faster.</span>
          </h1>

          {/* Subheadline */}
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: 'var(--text-2)',
            maxWidth: '560px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.65,
            animation: 'fadeUp 0.6s 0.2s var(--ease-out) both',
          }}>
            AI-powered skill extraction, deep resume analysis, and automated interview scheduling — all in one platform your team will love.
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '12px',
            justifyContent: 'center',
            animation: 'fadeUp 0.6s 0.3s var(--ease-out) both',
          }}>
            <Link to="/register" className="btn btn-primary btn-xl">
              Get Started Free
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-outline btn-xl">
              Sign In
            </Link>
          </div>

          {/* Trust note */}
          <div style={{
            marginTop: '2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '6px', color: 'var(--text-3)', fontSize: '0.8125rem',
            animation: 'fadeUp 0.6s 0.4s var(--ease-out) both',
          }}>
            <Shield size={13} />
            No credit card required · GDPR compliant · Free for candidates
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section style={{ padding: '3rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
          }}>
            {STATS.map(({ value, label }, i) => (
              <div key={label} className={`animate-fade-up delay-${i + 1}`}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  background: 'linear-gradient(135deg, var(--text-1), var(--text-2))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '4px',
                }}>
                  {value}
                </div>
                <div style={{ color: 'var(--text-3)', fontSize: '0.8125rem', fontWeight: 500 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: 'clamp(4rem, 8vw, 7rem) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.035em', marginBottom: '1rem' }}>
              Everything you need to hire brilliantly
            </h2>
            <p style={{ color: 'var(--text-2)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.65 }}>
              Purpose-built tools that remove friction and surface the candidates who will actually succeed.
            </p>
          </div>

          <div className="grid grid-3" style={{ gap: '1.5rem' }}>
            {FEATURES.map(({ icon: Icon, title, desc, color, bg }, i) => (
              <div key={title} className={`glass-panel card-glow animate-fade-up delay-${i + 1}`} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '16px',
                  background: bg, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', margin: '0 auto 1.5rem',
                  color,
                }}>
                  <Icon size={28} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '0.75rem' }}>{title}</h3>
                <p style={{ color: 'var(--text-2)', lineHeight: 1.65, fontSize: '0.9375rem' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.035em', marginBottom: '1rem' }}>
              Up and running in minutes
            </h2>
            <p style={{ color: 'var(--text-2)', maxWidth: '480px', margin: '0 auto' }}>
              No complex setup, no lengthy onboarding. Just post, apply, and hire.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}>
            {STEPS.map(({ num, title, desc }, i) => (
              <div key={num} className={`animate-fade-up delay-${i + 1}`} style={{
                position: 'relative',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                overflow: 'hidden',
              }}>
                {/* Step number watermark */}
                <div style={{
                  position: 'absolute', top: '12px', right: '20px',
                  fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 900,
                  color: 'rgba(255,255,255,0.03)', lineHeight: 1, pointerEvents: 'none',
                }}>
                  {num}
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-dim))',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.875rem',
                  color: 'white', marginBottom: '1.25rem',
                  boxShadow: 'var(--shadow-primary-sm)',
                }}>
                  {num}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', marginBottom: '0.75rem' }}>{title}</h3>
                <p style={{ color: 'var(--text-2)', fontSize: '0.9375rem', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 0 clamp(4rem, 8vw, 6rem)' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(6,182,212,0.1) 100%)',
            border: '1px solid rgba(124,58,237,0.25)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'clamp(2.5rem, 5vw, 4rem)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div aria-hidden style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle at 30% 50%, rgba(124,58,237,0.1) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(6,182,212,0.08) 0%, transparent 60%)',
              pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                fontWeight: 800, letterSpacing: '-0.035em', marginBottom: '1rem',
              }}>
                Ready to transform your hiring?
              </h2>
              <p style={{ color: 'var(--text-2)', marginBottom: '2rem', fontSize: '1rem', maxWidth: '420px', margin: '0 auto 2rem' }}>
                Join hundreds of companies already using RecruitPro to find exceptional talent.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Start for Free <ArrowRight size={16} />
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  Sign In
                </Link>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {['No credit card', 'Cancel anytime', 'GDPR compliant'].map(t => (
                  <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-3)', fontSize: '0.8125rem' }}>
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
