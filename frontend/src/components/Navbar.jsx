import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, LayoutDashboard, Briefcase, PlusCircle, ClipboardList, Calendar, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const candidateLinks = [
    { to: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
    { to: '/jobs',         label: 'Job Board',    icon: Briefcase },
    { to: '/applications', label: 'Applications', icon: ClipboardList },
    { to: '/interviews',   label: 'Interviews',   icon: Calendar },
  ];

  const recruiterLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/post-job',  label: 'Post Job',  icon: PlusCircle },
  ];

  const links = user?.role === 'recruiter' ? recruiterLinks : candidateLinks;

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="container">
          {/* Brand */}
          <Link to="/" className="nav-brand">
            <div className="nav-brand-icon">
              <Sparkles size={17} color="white" />
            </div>
            RecruitPro
          </Link>

          {/* Desktop Links */}
          <div className="nav-links">
            {user ? (
              <>
                {links.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`nav-link${isActive(to) ? ' active' : ''}`}
                  >
                    <Icon size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                    {label}
                  </Link>
                ))}

                <div className="nav-user" style={{ marginLeft: '8px' }}>
                  <div className="nav-avatar" title={user.full_name}>{initials}</div>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline btn-sm"
                    title="Logout"
                    style={{ gap: '6px' }}
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login"    className="nav-link">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} color="var(--text-2)" /> : <Menu size={22} color="var(--text-2)" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="nav-mobile-menu">
            {user ? (
              <>
                {links.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`nav-link${isActive(to) ? ' active' : ''}`}
                  >
                    <Icon size={15} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                    {label}
                  </Link>
                ))}
                <div className="divider" style={{ margin: '8px 0' }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="nav-avatar">{initials}</div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-1)' }}>{user.full_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', textTransform: 'capitalize' }}>{user.role}</div>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ gap: '6px' }}>
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login"    className="nav-link">Login</Link>
                <Link to="/register" className="btn btn-primary" style={{ margin: '8px 16px' }}>Get Started</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
