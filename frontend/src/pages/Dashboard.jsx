import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ListTodo, 
  TrendingUp, 
  Users, 
  Zap,
  ArrowUpRight,
  MoreVertical,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
        style={{ width: 40, height: 40, border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} 
      />
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const statCards = [
    { label: 'Total Tasks', value: stats.total, icon: ListTodo, color: 'var(--primary)', trend: '+12% from last week' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'var(--success)', trend: '+5% from last week' },
    { label: 'Active Tasks', value: stats.pending + stats.in_progress, icon: Zap, color: 'var(--warning)', trend: '-2% from last week' },
    { label: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'var(--danger)', trend: 'Same as last week' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <motion.div 
      className="dashboard-wrapper"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <header className="dashboard-header">
        <div>
          <h1 className="animate-fade-in">{getGreeting()}, Team!</h1>
          <p className="text-secondary">Here's what's happening with your projects today.</p>
        </div>
        <button className="btn btn-primary" onClick={() => window.location.href='/tasks'}>
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </header>

      <div className="dashboard-stats">
        {statCards.map((card, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            className="stat-card glass-card"
          >
            <div className="stat-icon-wrapper" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
              <card.icon size={24} />
            </div>
            <div className="stat-content">
              <h3>{card.label}</h3>
              <div className="stat-value-group">
                <p className="stat-number">{card.value}</p>
                <span className="stat-trend">
                  <TrendingUp size={14} />
                  {card.trend}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-main-grid">
        <motion.div variants={itemVariants} className="grid-item glass-card productivity-card">
          <div className="card-header">
            <h3>Weekly Productivity</h3>
            <button className="icon-btn"><MoreVertical size={18} /></button>
          </div>
          <div className="chart-placeholder">
            {stats.productivity?.map((height, i) => (
              <div key={i} className="chart-bar-wrapper">
                <motion.div 
                  className="chart-bar"
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: 0.5 + (i * 0.1), duration: 0.8 }}
                />
                <span className="bar-label">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {stats.role === 'admin' ? (
          <motion.div variants={itemVariants} className="grid-item glass-card team-card">
            <div className="card-header">
              <h3>Top Contributors</h3>
              <button className="btn-ghost">View All</button>
            </div>
            <div className="team-list">
              {stats.contributors && stats.contributors.length > 0 ? (
                stats.contributors.map((member, i) => (
                  <div key={i} className="team-item">
                    <div className="member-avatar">{member.name[0].toUpperCase()}</div>
                    <div className="member-info">
                      <h4>{member.name}</h4>
                      <span>{member.role}</span>
                    </div>
                    <div className="member-stats">
                      <strong>{member.tasks}</strong>
                      <span>completed</span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No contributors yet.</div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="grid-item glass-card team-card">
            <div className="card-header">
              <h3>My Recent Tasks</h3>
              <button className="btn-ghost" onClick={() => window.location.href='/tasks'}>View All</button>
            </div>
            <div className="team-list">
              {stats.recent_tasks && stats.recent_tasks.length > 0 ? (
                stats.recent_tasks.map((task, i) => (
                  <div key={i} className="team-item">
                    <div className="member-avatar" style={{ background: 'rgba(124, 58, 237, 0.1)', color: 'var(--primary)' }}>
                      <ListTodo size={18} />
                    </div>
                    <div className="member-info">
                      <h4 style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>{task.title}</h4>
                      <span style={{ textTransform: 'capitalize' }}>{task.status.replace('-', ' ')}</span>
                    </div>
                    <div className="member-stats">
                      <span style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>
                        {task.due_date ? new Date(task.due_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'No Date'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No recent tasks found.</div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
        }

        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .stat-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .stat-card::after {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 100px; height: 100px;
          background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
          opacity: 0.05;
          transform: translate(30%, -30%);
        }

        .stat-icon-wrapper {
          width: 3.25rem;
          height: 3.25rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          box-shadow: 0 8px 16px -4px rgba(0,0,0,0.2);
        }

        .stat-content h3 {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-value-group {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
        }

        .stat-number {
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1;
          font-family: 'Outfit', sans-serif;
        }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--success);
          background: rgba(16, 185, 129, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
        }

        .dashboard-main-grid {
          display: grid;
          grid-template-columns: 1.8fr 1.2fr;
          gap: 1.5rem;
        }

        .grid-item {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .card-header h3 {
          font-size: 1.125rem;
          font-weight: 600;
        }

        .chart-placeholder {
          height: 240px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding: 1rem 0.5rem;
          gap: 1rem;
          background: rgba(0,0,0,0.1);
          border-radius: 12px;
          margin-top: auto;
        }

        .chart-bar-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          height: 100%;
          justify-content: flex-end;
        }

        .chart-bar {
          width: 100%;
          max-width: 40px;
          background: linear-gradient(to top, var(--primary), #4F46E5);
          border-radius: 8px 8px 4px 4px;
          transition: var(--transition);
          position: relative;
        }

        .chart-bar:hover {
          filter: brightness(1.2);
          transform: scaleX(1.05);
        }

        .chart-bar::after {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(to bottom, rgba(255,255,255,0.2), transparent);
          border-radius: inherit;
        }

        .bar-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .team-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .team-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          border: 1px solid var(--border);
          transition: var(--transition);
        }

        .team-item:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--primary);
          transform: translateX(5px);
        }

        .member-avatar {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--primary), #4F46E5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
        }

        .member-info {
          flex: 1;
        }

        .member-info h4 {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 0.15rem;
        }

        .member-info span {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .member-stats {
          text-align: right;
        }

        .member-stats strong {
          display: block;
          font-size: 1rem;
          color: var(--primary);
        }

        .member-stats span {
          font-size: 0.625rem;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--text-secondary);
          letter-spacing: 0.05em;
        }

        @media (max-width: 1200px) {
          .dashboard-main-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dashboard-stats {
            grid-template-columns: 1fr;
          }
        }

      `}} />
    </motion.div>
  );
};

export default Dashboard;
