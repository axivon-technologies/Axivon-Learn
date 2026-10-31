import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingState from '../../components/feedback/LoadingState';
import EmptyState from '../../components/feedback/EmptyState';
import ErrorState from '../../components/feedback/ErrorState';

interface Course {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  level: string;
  status: string;
  moduleCount: number;
  lessonCount: number;
  estimatedDurationHours?: number;
}

export const CoursesCatalogPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCourses = () => {
    setLoading(true);
    setError(null);
    fetch('/api/v1/courses')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load courses from API');
        return res.json();
      })
      .then((data) => {
        setCourses(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Unable to connect to course service');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const categories = ['all', 'AI & Machine Learning', 'Web Development', 'Cloud & DevOps'];

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = selectedCategory === 'all' || c.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="app-container" style={{ padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Course Catalog
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Explore published technical courses. Filter by domain or search for specific technologies.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ textTransform: 'capitalize' }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ minWidth: '240px' }}>
          <input
            type="text"
            className="form-input"
            style={{ width: '100%' }}
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Content Rendering States */}
      {loading && <LoadingState message="Fetching published catalog..." count={3} />}

      {error && (
        <ErrorState
          title="Catalog Service Notice"
          message={error}
          onRetry={fetchCourses}
        />
      )}

      {!loading && !error && filteredCourses.length === 0 && (
        <EmptyState
          title="No courses found"
          description={
            courses.length === 0
              ? 'No courses have been published to the catalog yet. Run the database seeder or publish a course from the Admin CMS.'
              : 'No courses matched your current filter criteria.'
          }
          actionLabel={courses.length === 0 ? 'Open Admin CMS' : 'Clear Filters'}
          actionLink={courses.length === 0 ? '/admin/courses/new' : '/courses'}
        />
      )}

      {!loading && !error && filteredCourses.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredCourses.map((course) => (
            <div key={course.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="badge badge-primary">{course.category}</span>
                <span className="badge badge-warning" style={{ textTransform: 'capitalize' }}>{course.level}</span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {course.title}
              </h3>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5, flex: '1 0 auto', marginBottom: '1.25rem' }}>
                {course.summary}
              </p>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem', color: 'var(--text-dim)' }}>
                <span>{course.lessonCount || 0} Lessons • {course.estimatedDurationHours || 4}h</span>
                <Link to={`/courses/${course.slug}`} className="btn btn-secondary btn-sm">
                  View Syllabus →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesCatalogPage;
