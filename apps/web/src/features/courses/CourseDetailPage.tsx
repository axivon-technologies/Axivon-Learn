import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadingState from '../../components/feedback/LoadingState';
import ErrorState from '../../components/feedback/ErrorState';

interface Lesson {
  id: string;
  title: string;
  slug: string;
  durationMinutes?: number;
  isFreePreview: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseDetail {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  level: string;
  estimatedDurationHours?: number;
  outcomes?: string[];
  prerequisites?: string[];
  modules?: Module[];
}

export const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolled, setEnrolled] = useState(false);

  const fetchCourse = () => {
    setLoading(true);
    setError(null);
    fetch(`/api/v1/courses/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Course not found or currently unavailable');
        return res.json();
      })
      .then((data) => {
        setCourse(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCourse();
  }, [slug]);

  if (loading) {
    return (
      <div className="app-container" style={{ padding: '3rem 1rem' }}>
        <LoadingState message="Loading course curriculum and syllabus..." count={4} />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="app-container" style={{ padding: '3rem 1rem' }}>
        <ErrorState
          title="Course Not Found"
          message={error || 'The requested course does not exist or has not been published.'}
          onRetry={fetchCourse}
        />
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/courses" className="btn btn-secondary btn-sm">← Back to Course Catalog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ padding: '2.5rem 1rem' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
        <Link to="/courses">Courses</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-muted)' }}>{course.category}</span>
        <span>/</span>
        <span style={{ color: 'var(--text-main)' }}>{course.title}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
        {/* Left: Course Details & Syllabus */}
        <div style={{ flex: '2 1 0%' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <span className="badge badge-primary">{course.category}</span>
            <span className="badge badge-warning" style={{ textTransform: 'capitalize' }}>{course.level}</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem' }}>
            {course.title}
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            {course.description || course.summary}
          </p>

          {/* Outcomes */}
          {course.outcomes && course.outcomes.length > 0 && (
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>What You Will Learn</h3>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                {course.outcomes.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Syllabus Modules */}
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem' }}>Course Syllabus</h3>
            {(!course.modules || course.modules.length === 0) ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>Detailed module structure is being finalized.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {course.modules.map((mod, index) => (
                  <div key={mod.id || index} className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.75rem', color: 'var(--color-secondary)' }}>
                      Module {index + 1}: {mod.title}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {mod.lessons.map((lesson, lIdx) => (
                        <div key={lesson.id || lIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
                          <span>{index + 1}.{lIdx + 1} {lesson.title}</span>
                          <Link to={`/learn/${course.slug}/${lesson.id || lesson.slug}`} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)' }}>
                            Open Lesson →
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Enrollment Card */}
        <div style={{ flex: '1 1 300px' }}>
          <div className="card" style={{ position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Course Enrollment</h3>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-success)', marginBottom: '1rem' }}>
              Free Access
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Enroll to save your lesson progress, take interactive quizzes, and earn course completion recognition.
            </p>

            {enrolled ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span className="badge badge-success" style={{ alignSelf: 'flex-start' }}>Enrolled</span>
                <Link to={`/dashboard`} className="btn btn-primary" style={{ width: '100%' }}>
                  Go to Learner Dashboard →
                </Link>
              </div>
            ) : (
              <button
                onClick={() => setEnrolled(true)}
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '1rem' }}
              >
                Enroll Now (Free)
              </button>
            )}

            <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '1.5rem', paddingTop: '1rem', fontSize: '0.8125rem', color: 'var(--text-dim)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div>⏱ Estimated Duration: {course.estimatedDurationHours || 4} hours</div>
              <div>⚡ Prerequisites: {course.prerequisites?.join(', ') || 'None'}</div>
              <div>📜 Assessment: MCQ Quizzes included</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
