import React, { useState, useEffect, useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Sparkles, LogOut, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate         = useNavigate();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const candidateLinks = [
    { to: '/dashboard',    label: 'Dashboard' },
    { to: '/jobs',         label: 'Job Board' },
    { to: '/applications', label: 'Applications' },
    { to: '/interviews',   label: 'Interviews' },
  ];

  const recruiterLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/post-job',  label: 'Post Job' },
  ];

  const links = user?.role === 'recruiter' ? recruiterLinks : candidateLinks;

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '';

  return (
    <header>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="container">
          {/* Brand */}
          <Link to={user ? '/dashboard' : '/'} className="nav-brand">
            <div className="nav-brand-icon">
              <Sparkles size={16} color="white" />
            </div>
            RecruitPro
          </Link>

          {/* Desktop nav */}
          {user && (
            <div className="nav-links">
              {links.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  {label}
                </NavLink>
              ))}
            </div>
          )}

          {/* Desktop user area */}
          {user ? (
            <div className="nav-user">
              <div className="nav-avatar" title={user.full_name}>{initials}</div>
              <button
                onClick={handleLogout}
                className="btn btn-ghost btn-sm"
                aria-label="Sign out"
              >
                <LogOut size={15} /> Sign out
              </button>
            </div>
          ) : (
            <div className="nav-user">
              <Link to="/login"    className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          {user && (
            <button
              className="nav-hamburger"
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X size={22} color="var(--text-1)" /> : <Menu size={22} color="var(--text-1)" />}
            </button>
          )}
        </div>

        {/* Mobile menu drawer */}
        {user && menuOpen && (
          <div className="nav-mobile-menu">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}

            <div className="nav-mobile-divider" />

            <div className="nav-mobile-user-row">
              <div className="nav-mobile-user-info">
                <div className="nav-avatar">{initials}</div>
                <div>
                  <div className="nav-mobile-name">{user.full_name}</div>
                  <div className="nav-mobile-role">{user.role}</div>
                </div>
              </div>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                <LogOut size={14} /> Sign out
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
