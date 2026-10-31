import React, { useState } from 'react';

export const ContactPage: React.FC = () => {
  const [sent, setSent] = useState(false);

  return (
    <div className="app-container" style={{ padding: '3rem 1rem', maxWidth: '640px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        Contact & Support
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Reach the AXIVON LEARN technical support and platform administration team.
      </p>

      {sent ? (
        <div className="card" style={{ textAlign: 'center', borderColor: 'var(--color-success)' }}>
          <span className="badge badge-success" style={{ marginBottom: '0.75rem' }}>Message Dispatched</span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Thank you for reaching out</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Our team will review your inquiry and respond within 2 business days.
          </p>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" placeholder="Your Name" required />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="you@domain.com" required />
          </div>

          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea className="form-input" rows={4} placeholder="How can we assist you with AXIVON LEARN?" required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            Send Inquiry
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactPage;
