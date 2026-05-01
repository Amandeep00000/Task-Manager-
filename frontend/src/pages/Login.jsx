import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { LogIn, Mail, Lock, ArrowRight, ShieldCheck, Sparkles, Zap, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      {/* Background Glows */}
      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>

      <div className="login-content">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="login-branding"
        >
          <div className="brand-badge">
            <Zap size={14} />
            <span>Fast & Secure Access</span>
          </div>
          <h1>Continue your <br /><span className="gradient-text">Journey</span></h1>
          <p>Experience the next level of project management. Access your workspace with enterprise-grade security.</p>
          
          <div className="login-stats">
            <div className="mini-stat">
              <div className="stat-value">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
            <div className="mini-stat">
              <div className="stat-value">128-bit</div>
              <div className="stat-label">Encryption</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="login-card glass-card"
        >
          <div className="card-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
          </div>

          {error && <div className="error-alert">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-box">
                <Mail size={18} />
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="label-row">
                <label>Password</label>
                <Link to="/forgot-password">Forgot?</Link>
              </div>
              <div className="input-box">
                <Lock size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              <span>Sign In to Workspace</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="card-footer">
            <p>Don't have an account? <Link to="/signup">Get Started <ChevronRight size={14} /></Link></p>
          </div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .login-container {
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

        .bg-glow {
          position: absolute;
          filter: blur(120px);
          opacity: 0.3;
          z-index: 0;
        }

        .glow-1 { width: 500px; height: 500px; background: #5850c6ff; top: -150px; right: -150px; }
        .glow-2 { width: 400px; height: 400px; background: #683cc1ff; bottom: -100px; left: -100px; }

        .login-content {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          max-width: 1100px;
          width: 100%;
          align-items: center;
        }

        .login-branding { color: white; }

        .brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 2rem;
          color: #60A5FA;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 2rem;
        }

        .login-branding h1 {
          font-size: 3.5rem;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }

        .gradient-text {
          background: linear-gradient(135deg, #60A5FA, #A78BFA);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .login-branding p {
          font-size: 1.25rem;
          color: #94A3B8;
          line-height: 1.6;
          margin-bottom: 3rem;
        }

        .login-stats {
          display: flex;
          gap: 3rem;
        }

        .mini-stat .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.25rem;
        }

        .mini-stat .stat-label {
          font-size: 0.875rem;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .login-card {
          padding: 3.5rem;
          width: 100%;
          max-width: 480px;
          margin-left: auto;
        }

        .card-header { margin-bottom: 2.5rem; }
        .card-header h2 { font-size: 2.25rem; margin-bottom: 0.5rem; }
        .card-header p { color: #94A3B8; }

        .login-form { display: grid; gap: 1.5rem; }

        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #94A3B8;
        }

        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .label-row a {
          font-size: 0.75rem;
          color: #7C3AED;
          text-decoration: none;
        }

        .input-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-box svg {
          position: absolute;
          left: 1.25rem;
          color: #64748B;
        }

        .input-box input {
          width: 100%;
          padding: 1rem 1rem 1rem 3.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .input-box input:focus {
          border-color: #3B82F6;
          background: rgba(59, 130, 246, 0.05);
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
          outline: none;
        }

        .submit-btn {
          margin-top: 1rem;
          padding: 1.125rem;
          background: linear-gradient(135deg, #3B82F6, #7C3AED);
          color: white;
          border: none;
          border-radius: 1rem;
          font-weight: 700;
          font-size: 1.125rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.3s ease;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
        }

        .card-footer {
          margin-top: 2.5rem;
          text-align: center;
          font-size: 1rem;
          color: #94A3B8;
        }

        .card-footer a {
          color: #7C3AED;
          text-decoration: none;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          margin-left: 0.5rem;
        }

        .error-alert {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
          padding: 1rem;
          border-radius: 0.75rem;
          border: 1px solid rgba(239, 68, 68, 0.2);
          margin-bottom: 2rem;
          font-size: 0.875rem;
        }

        @media (max-width: 1024px) {
          .login-content { grid-template-columns: 1fr; gap: 3rem; text-align: center; }
          .login-branding h1 { font-size: 2.75rem; }
          .login-card { margin: 0 auto; padding: 2.5rem; }
          .login-stats { justify-content: center; }
        }
      `}} />
    </div>
  );
};

export default Login;
