import React, { useState } from 'react';

export const AdminCategoriesPage: React.FC = () => {
  const [categories] = useState([
    { id: 'cat-1', name: 'AI & Machine Learning', slug: 'ai-ml', courseCount: 1 },
    { id: 'cat-2', name: 'Web Development', slug: 'web-development', courseCount: 1 },
    { id: 'cat-3', name: 'Cloud & DevOps', slug: 'cloud-devops', courseCount: 0 }
  ]);

  return (
    <div className="app-container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        Categories & Tags Manager
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Organize courses by technology domains.
      </p>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.875rem 1rem' }}>Category Name</th>
              <th style={{ padding: '0.875rem 1rem' }}>Slug</th>
              <th style={{ padding: '0.875rem 1rem' }}>Courses</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '1rem', fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{c.slug}</td>
                <td style={{ padding: '1rem' }}>{c.courseCount} Courses</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
