import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export const AdminLayout: React.FC = () => {
  const location = useLocation();

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      {/* Admin Warning / Control Banner */}
      <div style={{ background: '#1E1B4B', borderBottom: '1px solid hsla(245, 82%, 60%, 0.3)', padding: '0.75rem 0' }}>
        <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="badge badge-warning" style={{ background: '#451A03', color: '#FCD34D' }}>Admin Control Center</span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Link to="/admin" className={`btn btn-sm ${isCurrent('/admin') ? 'btn-primary' : 'btn-ghost'}`}>
                Overview
              </Link>
              <Link to="/admin/courses" className={`btn btn-sm ${isCurrent('/admin/courses') ? 'btn-primary' : 'btn-ghost'}`}>
                Courses CMS
              </Link>
              <Link to="/admin/courses/new" className={`btn btn-sm ${isCurrent('/admin/courses/new') ? 'btn-primary' : 'btn-ghost'}`}>
                + New Course
              </Link>
              <Link to="/admin/categories" className={`btn btn-sm ${isCurrent('/admin/categories') ? 'btn-primary' : 'btn-ghost'}`}>
                Categories
              </Link>
              <Link to="/admin/quizzes" className={`btn btn-sm ${isCurrent('/admin/quizzes') ? 'btn-primary' : 'btn-ghost'}`}>
                Quizzes
              </Link>
            </div>
          </div>

          <div style={{ fontSize: '0.8125rem', color: '#C7D2FE' }}>
            Authorization: <span style={{ fontWeight: 600 }}>Administrator (Role: admin)</span>
          </div>
        </div>
      </div>

      <main className="main-content" style={{ padding: '2rem 0' }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default AdminLayout;
