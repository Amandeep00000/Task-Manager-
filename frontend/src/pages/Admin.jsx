import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
  Users, 
  FolderKanban, 
  ClipboardList, 
  TrendingUp, 
  Shield, 
  Trash2, 
  UserCog, 
  Activity,
  Search,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Admin = () => {
  const [stats, setStats] = useState({ users: 0, projects: 0, tasks: 0, productivity: 0 });
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, activityRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/activity')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setActivity(activityRes.data);
    } catch (err) {
      console.error("Admin data fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateUserRole = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}`, { role });
      setUsers(users.map(u => u.id === userId ? { ...u, role } : u));
    } catch (err) { alert("Failed to update role"); }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure? This will delete all user data.")) {
      try {
        await api.delete(`/admin/users/${userId}`);
        setUsers(users.filter(u => u.id !== userId));
      } catch (err) { alert(err.response?.data?.error || "Failed to delete user"); }
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-page animate-fade-in">
      <header className="page-header">
        <div>
          <h1>Admin Command Center</h1>
          <p className="text-secondary">System-wide monitoring and resource management.</p>
        </div>
        <div className="admin-badge">
          <ShieldCheck size={18} />
          <span>Restricted Access</span>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon users"><Users size={24} /></div>
          <div className="stat-info">
            <label>Total Users</label>
            <h3>{stats.users}</h3>
          </div>
          <div className="stat-trend positive">
            <TrendingUp size={14} /> 12%
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon projects"><FolderKanban size={24} /></div>
          <div className="stat-info">
            <label>Total Projects</label>
            <h3>{stats.projects}</h3>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon tasks"><ClipboardList size={24} /></div>
          <div className="stat-info">
            <label>Total Tasks</label>
            <h3>{stats.tasks}</h3>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon productivity"><Activity size={24} /></div>
          <div className="stat-info">
            <label>Productivity</label>
            <h3>{stats.productivity}%</h3>
          </div>
        </div>
      </div>

      <div className="admin-content-grid">
        <section className="users-section glass-card">
          <div className="section-header">
            <h3>User Management</h3>
            <div className="search-box glass">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="user-table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-cell">
                        <div className="mini-avatar">{u.username[0].toUpperCase()}</div>
                        <div className="user-meta">
                          <strong>{u.username}</strong>
                          <span>{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <select 
                        value={u.role} 
                        onChange={(e) => updateUserRole(u.id, e.target.value)}
                        className="role-select"
                        disabled={u.id === 1}
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>{new Date(u.join_date).toLocaleDateString()}</td>
                    <td>
                      <div className="table-actions">
                        <button className="icon-btn danger" onClick={() => deleteUser(u.id)} disabled={u.id === 1}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="activity-section glass-card">
          <div className="section-header">
            <h3>System Activity</h3>
            <Activity size={18} className="text-primary" />
          </div>
          <div className="activity-feed">
            {activity.map((log, i) => (
              <div key={log.id} className="activity-log-item">
                <div className="log-marker"></div>
                <div className="log-content">
                  <p><strong>{log.username}</strong> {log.action}</p>
                  <span>{new Date(log.created_at).toLocaleString()} • {log.ip_address}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .admin-page { display: flex; flex-direction: column; gap: 2rem; }

        .admin-badge {
          display: flex; align-items: center; gap: 0.5rem;
          background: rgba(16, 185, 129, 0.1); color: var(--success);
          padding: 0.5rem 1rem; border-radius: 2rem; font-weight: 600; font-size: 0.875rem;
        }

        .stats-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem;
        }

        .stat-card {
          padding: 1.5rem; display: flex; align-items: center; gap: 1.5rem; position: relative;
        }

        .stat-icon {
          width: 50px; height: 50px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
        }

        .stat-icon.users { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }
        .stat-icon.projects { background: rgba(124, 58, 237, 0.1); color: var(--primary); }
        .stat-icon.tasks { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }
        .stat-icon.productivity { background: rgba(16, 185, 129, 0.1); color: #10B981; }

        .stat-info label { font-size: 0.8125rem; color: var(--text-secondary); text-transform: uppercase; }
        .stat-info h3 { font-size: 1.5rem; margin: 0; }

        .stat-trend {
          position: absolute; top: 1.5rem; right: 1.5rem;
          font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 0.25rem;
        }
        .stat-trend.positive { color: var(--success); }

        .admin-content-grid {
          display: grid; grid-template-columns: 1.8fr 1fr; gap: 1.5rem;
        }

        .section-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;
        }

        .user-table-container { overflow-x: auto; }
        .user-table { width: 100%; border-collapse: collapse; text-align: left; }
        .user-table th { padding: 1rem; font-size: 0.8125rem; color: var(--text-secondary); text-transform: uppercase; }
        .user-table td { padding: 1rem; border-top: 1px solid var(--glass-border); }

        .user-cell { display: flex; align-items: center; gap: 1rem; }
        .user-meta strong { display: block; font-size: 0.9375rem; }
        .user-meta span { font-size: 0.75rem; color: var(--text-secondary); }

        .role-select {
          background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border);
          color: var(--text-main); padding: 0.4rem 0.8rem; border-radius: 0.5rem; font-size: 0.875rem;
        }

        .activity-feed { display: flex; flex-direction: column; gap: 1.5rem; }
        .activity-log-item { display: flex; gap: 1rem; position: relative; }
        .activity-log-item:not(:last-child):after {
          content: ''; position: absolute; left: 4px; top: 1.5rem; bottom: -1rem;
          width: 1px; background: var(--glass-border);
        }

        .log-marker {
          width: 9px; height: 9px; border-radius: 50%; background: var(--primary);
          margin-top: 0.4rem; z-index: 1;
        }

        .log-content p { font-size: 0.875rem; margin: 0; }
        .log-content span { font-size: 0.75rem; color: var(--text-secondary); opacity: 0.7; }

        @media (max-width: 1200px) {
          .admin-content-grid { grid-template-columns: 1fr; }
        }
      `}} />
    </div>
  );
};

export default Admin;
