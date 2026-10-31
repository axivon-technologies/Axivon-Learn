import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export const AdminCourseEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState(isEditing ? 'AI & Machine Learning Foundations' : '');
  const [slug, setSlug] = useState(isEditing ? 'ai-ml-foundations' : '');
  const [category, setCategory] = useState('AI & Machine Learning');
  const [level, setLevel] = useState('beginner');
  const [status, setStatus] = useState('draft');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="app-container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link to="/admin/courses" style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>
            ← Back to Course List
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem' }}>
            {isEditing ? 'Edit Course Curriculum' : 'Create New Course'}
          </h1>
        </div>

        {saved && (
          <span className="badge badge-success">Saved Changes ✓</span>
        )}
      </div>

      <form onSubmit={handleSave} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="form-group">
          <label className="form-label">Course Title</label>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Distributed Cloud Architecture"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">URL Slug</label>
          <input
            type="text"
            className="form-input"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. distributed-cloud-architecture"
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="AI & Machine Learning">AI & Machine Learning</option>
              <option value="Web Development">Web Development</option>
              <option value="Cloud & DevOps">Cloud & DevOps</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Difficulty Level</label>
            <select className="form-input" value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Publication Status</label>
          <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="draft">Draft (Visible only to administrators)</option>
            <option value="published">Published (Visible to all public visitors)</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <Link to="/admin/courses" className="btn btn-ghost">Cancel</Link>
          <button type="submit" className="btn btn-primary">
            Save Course Metadata
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCourseEditorPage;
