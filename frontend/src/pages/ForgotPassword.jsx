import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import api from '../api';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-sidebar-split">
        <div className="branding-content">
          <div className="branding-logo">T</div>
          <h1>Reset Password</h1>
          <p>Don't worry, it happens to the best of us. We'll help you get back into your account in no time.</p>
        </div>
      </div>

      <div className="auth-content-split">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="auth-card glass-card"
        >
          {!submitted ? (
            <>
              <div className="auth-header">
                <h2>Forgot Password?</h2>
                <p>Enter your email and we'll send you reset instructions.</p>
              </div>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input 
                      type="email" 
                      placeholder="name@company.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>
            </>
          ) : (
            <div className="success-state">
              <CheckCircle size={48} className="text-success" />
              <h2>Check your email</h2>
              <p>We've sent a password reset link to <strong>{email}</strong></p>
              <button onClick={() => setSubmitted(false)} className="btn btn-outline" style={{ marginTop: '1.5rem', width: '100%' }}>
                Try another email
              </button>
            </div>
          )}

          <div className="auth-footer">
            <Link to="/login" className="back-link">
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>
          </div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .back-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 600;
          transition: var(--transition);
        }
        .back-link:hover { color: var(--primary); }
        .success-state { text-align: center; padding: 2rem 0; }
        .success-state h2 { margin: 1.5rem 0 0.5rem; }
        .success-state p { color: var(--text-secondary); }
        .text-success { color: var(--success); }
      `}} />
    </div>
  );
};

export default ForgotPassword;
