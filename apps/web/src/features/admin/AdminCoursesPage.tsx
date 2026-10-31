import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const AdminCoursesPage: React.FC = () => {
  const [courses] = useState([
    {
      id: 'course-1',
      title: 'AI & Machine Learning Foundations',
      slug: 'ai-ml-foundations',
      category: 'AI & Machine Learning',
      status: 'published',
      modules: 3,
      lessons: 12
    },
    {
      id: 'course-2',
      title: 'Full Stack Web Development',
      slug: 'full-stack-web-development',
      category: 'Web Development',
      status: 'published',
      modules: 4,
      lessons: 16
    }
  ]);

  return (
    <div className="app-container" style={{ padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800 }}>
            Course Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
            Review, edit, draft, and publish platform courses.
          </p>
        </div>

        <Link to="/admin/courses/new" className="btn btn-primary btn-sm">
          + Add New Course
        </Link>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.875rem 1rem' }}>Course Title</th>
              <th style={{ padding: '0.875rem 1rem' }}>Category</th>
              <th style={{ padding: '0.875rem 1rem' }}>Content Structure</th>
              <th style={{ padding: '0.875rem 1rem' }}>Status</th>
              <th style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '1rem', fontWeight: 600 }}>{c.title}</td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{c.category}</td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{c.modules} Modules • {c.lessons} Lessons</td>
                <td style={{ padding: '1rem' }}>
                  <span className={`badge ${c.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <Link to={`/admin/courses/${c.id}/edit`} className="btn btn-secondary btn-sm" style={{ marginRight: '0.5rem' }}>
                    Edit
                  </Link>
                  <Link to={`/courses/${c.slug}`} className="btn btn-ghost btn-sm" target="_blank">
                    Preview ↗
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCoursesPage;
