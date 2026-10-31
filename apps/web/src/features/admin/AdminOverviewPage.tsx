import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface AdminMetrics {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalCategories: number;
}

export const AdminOverviewPage: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminMetrics>({
    totalCourses: 2,
    publishedCourses: 2,
    draftCourses: 0,
    totalCategories: 3
  });

  useEffect(() => {
    fetch('/api/v1/admin/overview')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data) setMetrics(data.data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="app-container" style={{ padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-warning" style={{ background: '#451A03', color: '#FCD34D' }}>CMS Operations</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem' }}>
            Admin Overview
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage courses, syllabus hierarchies, lessons, and assessment quizzes.
          </p>
        </div>

        <Link to="/admin/courses/new" className="btn btn-primary">
          + Create New Course
        </Link>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Courses</div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--color-primary)' }}>{metrics.totalCourses}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Published Publicly</div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--color-success)' }}>{metrics.publishedCourses}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Draft State</div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--color-warning)' }}>{metrics.draftCourses}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Categories</div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--color-secondary)' }}>{metrics.totalCategories}</div>
        </div>
      </div>

      {/* Action Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        <div className="card card-interactive">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Course Curriculum CMS</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Author, reorder, preview, and publish course content without code modifications.
          </p>
          <Link to="/admin/courses" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
            Manage Courses →
          </Link>
        </div>

        <div className="card card-interactive">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Quiz & Assessment Builder</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Build multiple-choice question pools, configure passing scores, and link to lessons.
          </p>
          <Link to="/admin/quizzes" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
            Manage Quizzes →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
