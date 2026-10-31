import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header-root">
      <div className="app-container header-inner">
        <Link to="/" className="brand-link">
          <span style={{ fontSize: '1.5rem' }}>⚡</span>
          <span>AXIVON <span className="brand-badge">LEARN</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="nav-links">
          <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/courses" className={`nav-item ${isActive('/courses') ? 'active' : ''}`}>Courses</Link>
          <Link to="/learning-paths" className={`nav-item ${isActive('/learning-paths') ? 'active' : ''}`}>Learning Paths</Link>
          <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
          <Link to="/admin" className={`nav-item ${isActive('/admin') ? 'active' : ''}`}>Admin CMS</Link>
        </nav>

        {/* Auth CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex' }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--bg-surface-elevated)',
          borderBottom: '1px solid var(--border-default)',
          padding: '1rem var(--space-4)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="nav-item">Home</Link>
          <Link to="/courses" onClick={() => setMobileMenuOpen(false)} className="nav-item">Courses</Link>
          <Link to="/learning-paths" onClick={() => setMobileMenuOpen(false)} className="nav-item">Learning Paths</Link>
          <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="nav-item">Dashboard</Link>
          <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="nav-item">Admin CMS</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="nav-item">About</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
