import React from 'react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  // Demonstration baseline state (real learner data will be hydrated from /api/v1/enrollments)
  const enrolledCourses = [
    {
      id: 'course-1',
      title: 'AI & Machine Learning Foundations',
      slug: 'ai-ml-foundations',
      progressPercent: 35,
      completedLessons: 4,
      totalLessons: 12,
      lastLessonTitle: 'Supervised Learning & Regression Models'
    }
  ];

  return (
    <div className="app-container" style={{ padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Learner Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Welcome back. Continue your technical learning journey and review your active milestones.
        </p>
      </div>

      {/* Continue Learning Banner */}
      {enrolledCourses.length > 0 && (
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg-surface-elevated), #1A1F36)', border: '1px solid var(--border-default)', marginBottom: '2.5rem', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ maxWidth: '580px' }}>
              <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Continue Where You Left Off</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {enrolledCourses[0].title}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginBottom: '1rem' }}>
                Next: {enrolledCourses[0].lastLessonTitle}
              </p>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: '8px', background: 'var(--border-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: `${enrolledCourses[0].progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))', borderRadius: 'var(--radius-full)' }} />
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
                {enrolledCourses[0].completedLessons} of {enrolledCourses[0].totalLessons} lessons completed ({enrolledCourses[0].progressPercent}%)
              </div>
            </div>

            <Link to={`/learn/${enrolledCourses[0].slug}/lesson-1`} className="btn btn-primary">
              Resume Lesson →
            </Link>
          </div>
        </div>
      )}

      {/* Enrolled Courses Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Enrolled Courses</h3>
          <Link to="/courses" style={{ color: 'var(--color-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>
            + Explore Catalog
          </Link>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="feedback-box">
            <h4 className="feedback-title">No Enrolled Courses Yet</h4>
            <p className="feedback-desc">
              You haven't enrolled in any courses yet. Browse our curated course catalog and start learning.
            </p>
            <Link to="/courses" className="btn btn-primary btn-sm">Browse Catalog</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {enrolledCourses.map((c) => (
              <div key={c.id} className="card card-interactive">
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{c.title}</h4>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Progress: {c.progressPercent}% ({c.completedLessons}/{c.totalLessons} Lessons)
                </div>

                <div style={{ width: '100%', height: '6px', background: 'var(--border-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '1.25rem' }}>
                  <div style={{ width: `${c.progressPercent}%`, height: '100%', background: 'var(--color-primary)', borderRadius: 'var(--radius-full)' }} />
                </div>

                <Link to={`/courses/${c.slug}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  View Course Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
