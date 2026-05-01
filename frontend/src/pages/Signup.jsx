import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Globe, Lock, Mail, ShieldCheck, Sparkles, User, UserPlus, Zap } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'member'
  });
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', formData);
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      {/* Background Elements */}
      <div className="bg-blur circle-1"></div>
      <div className="bg-blur circle-2"></div>
      <div className="bg-blur circle-3"></div>

      <div className="signup-content">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="signup-branding"
        >
          <div className="brand-badge">
            <Sparkles size={14} />
            <span>AI Powered Collaboration</span>
          </div>
          <h1>Transform your team's <span className="gradient-text">Productivity</span></h1>
          <p>The most advanced project management platform for modern startups. Build, ship, and scale faster with TaskFlow.</p>

          <div className="feature-list">
            <div className="feature-item">
              <div className="icon-wrap"><Zap size={20} /></div>
              <div>
                <strong>Real-time Sync</strong>
                <span>Instant updates across all devices</span>
              </div>
            </div>
            <div className="feature-item">
              <div className="icon-wrap"><ShieldCheck size={20} /></div>
              <div>
                <strong>Enterprise Security</strong>
                <span>Bank-grade encryption & 2FA</span>
              </div>
            </div>
            <div className="feature-item">
              <div className="icon-wrap"><Globe size={20} /></div>
              <div>
                <strong>Global Teams</strong>
                <span>Collaborate from anywhere in the world</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="signup-card glass-card"
        >
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="success-view"
              >
                <div className="success-anim">
                  <CheckCircle size={80} />
                </div>
                <h2>Account Created!</h2>
                <p>Welcome to the future of work. We're redirecting you to sign in...</p>
              </motion.div>
            ) : (
              <motion.div key="form" exit={{ opacity: 0, y: -20 }}>
                <div className="card-header">
                  <h2>Get Started</h2>
                  <p>Create your free account in seconds</p>
                </div>

                {error && <div className="error-alert">{error}</div>}

                <form onSubmit={handleSubmit} className="signup-form">
                  <div className="form-row">
                    <div className="input-group">
                      <label>Username</label>
                      <div className="input-box">
                        <User size={18} />
                        <input
                          type="text"
                          placeholder="Enter your username"
                          value={formData.username}
                          onChange={e => setFormData({ ...formData, username: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Email Address</label>
                    <div className="input-box">
                      <Mail size={18} />
                      <input
                        type="email"
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Password</label>
                    <div className="input-box">
                      <Lock size={18} />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Workspace Role</label>
                    <div className="input-box">
                      <UserPlus size={18} />
                      <select
                        value={formData.role}
                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="submit-btn">
                    <span>Create Free Account</span>
                    <ArrowRight size={18} />
                  </button>
                </form>

                <div className="card-footer">
                  <p>Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .signup-container {
          min-height: 100vh;
          width: 100%;
          background: #0B1120;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .bg-blur {
          position: absolute;
          filter: blur(100px);
          opacity: 0.4;
          z-index: 0;
        }

        .circle-1 { width: 400px; height: 400px; background: #7C3AED; top: -100px; left: -100px; }
        .circle-2 { width: 300px; height: 300px; background: #3B82F6; bottom: -50px; right: -50px; }
        .circle-3 { width: 250px; height: 250px; background: #EC4899; top: 40%; left: 50%; }

        .signup-content {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          max-width: 1200px;
          width: 100%;
          align-items: center;
        }

        .signup-branding {
          color: white;
        }

        .brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(124, 58, 237, 0.1);
          border: 1px solid rgba(124, 58, 237, 0.2);
          border-radius: 2rem;
          color: #A78BFA;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 2rem;
        }

        .signup-branding h1 {
          font-size: 3.5rem;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }

        .gradient-text {
          background: linear-gradient(135deg, #7C3AED, #3B82F6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .signup-branding p {
          font-size: 1.25rem;
          color: #94A3B8;
          line-height: 1.6;
          margin-bottom: 3rem;
        }

        .feature-list {
          display: grid;
          gap: 1.5rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .icon-wrap {
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7C3AED;
        }

        .feature-item strong { display: block; font-size: 1rem; margin-bottom: 0.15rem; }
        .feature-item span { font-size: 0.875rem; color: #94A3B8; }

        .signup-card {
          padding: 3rem;
          width: 100%;
          max-width: 480px;
          margin-left: auto;
        }

        .card-header { margin-bottom: 2.5rem; }
        .card-header h2 { font-size: 2rem; margin-bottom: 0.5rem; }
        .card-header p { color: #94A3B8; }

        .signup-form { display: grid; gap: 1.25rem; }

        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #94A3B8;
        }

        .input-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-box svg {
          position: absolute;
          left: 1rem;
          color: #64748B;
        }

        .input-box input, .input-box select {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 3rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .input-box input:focus, .input-box select:focus {
          border-color: #7C3AED;
          background: rgba(124, 58, 237, 0.05);
          box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
          outline: none;
        }

        .submit-btn {
          margin-top: 1rem;
          padding: 1rem;
          background: linear-gradient(135deg, #7C3AED, #4F46E5);
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.3s ease;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(124, 58, 237, 0.4);
        }

        .card-footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.9375rem;
          color: #94A3B8;
        }

        .card-footer a {
          color: #7C3AED;
          text-decoration: none;
          font-weight: 600;
        }

        .error-alert {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
          padding: 1rem;
          border-radius: 0.75rem;
          border: 1px solid rgba(239, 68, 68, 0.2);
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
        }

        .success-view {
          text-align: center;
          padding: 2rem 0;
        }

        .success-anim {
          color: #10B981;
          margin-bottom: 1.5rem;
          animation: bounce 1s infinite alternate;
        }

        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-10px); }
        }

        @media (max-width: 1024px) {
          .signup-content { grid-template-columns: 1fr; gap: 3rem; }
          .signup-branding { text-align: center; }
          .signup-branding h1 { font-size: 2.5rem; }
          .signup-card { margin: 0 auto; }
          .feature-list { display: none; }
        }
      `}} />
    </div>
  );
};

export default Signup;
