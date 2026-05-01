import React, { useState, useEffect } from 'react';
import { Search, Bell, X, ChevronDown, User, LogOut, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { useAuth } from '../AuthContext';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const TopNav = () => {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const [notifRes, countRes] = await Promise.all([
        api.get('/notifications'),
        api.get('/notifications/unread-count')
      ]);
      setNotifications(notifRes.data);
      setUnreadCount(countRes.data.count);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  const markAllRead = async () => {
    try {
      await api.post('/notifications/mark-all-read');
      fetchNotifications();
    } catch (err) { console.error(err); }
  };

  const deleteNotification = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <header className="topnav glass">
      <div className="search-container">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search tasks, projects..." />
      </div>

      <div className="nav-actions">
        <div className="notif-relative">
          <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={20} />
            {unreadCount > 0 && <span className="notification-dot">{unreadCount}</span>}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="notification-dropdown glass"
              >
                <div className="notif-header">
                  <h3>Notifications</h3>
                  <button onClick={markAllRead}>Mark all read</button>
                </div>
                <div className="notif-list">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div key={n.id} className={`notif-item ${!n.is_read ? 'unread' : ''}`}>
                        <div className="notif-icon">
                          {n.type === 'task' ? <CheckCircle size={14} /> : <Clock size={14} />}
                        </div>
                        <div className="notif-body">
                          <strong>{n.title}</strong>
                          <p>{n.message}</p>
                          <span>{new Date(n.created_at).toLocaleTimeString()}</span>
                        </div>
                        <button onClick={(e) => deleteNotification(e, n.id)} className="delete-notif">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="notif-empty">No notifications</div>
                  )}
                </div>
                <div className="notif-footer">
                  <button>View all activity</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="user-dropdown-container">
          <button className="profile-trigger" onClick={() => setShowProfile(!showProfile)}>
            <div className="mini-avatar">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="trigger-info">
              <span>{user?.username}</span>
              <ChevronDown size={14} />
            </div>
          </button>
          
          <AnimatePresence>
            {showProfile && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="profile-dropdown glass"
              >
                <div className="p-header">
                  <strong>{user?.username}</strong>
                  <span>{user?.email}</span>
                </div>
                <div className="p-links">
                  <a href="/profile"><User size={16} /> My Profile</a>
                  <button onClick={logout} className="logout-btn"><LogOut size={16} /> Logout</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .topnav {
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 1500;
          margin-bottom: 2rem;
          border-radius: 0 0 1.25rem 1.25rem;
          border-bottom: 1px solid var(--glass-border);
        }

        .notif-relative { position: relative; }

        .notification-dropdown {
          position: absolute;
          top: 50px;
          right: 0;
          width: 320px;
          border-radius: 1rem;
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow-lg);
          padding: 0;
          overflow: hidden;
        }

        .notif-header {
          padding: 1rem;
          border-bottom: 1px solid var(--glass-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .notif-header h3 { font-size: 1rem; margin: 0; }
        .notif-header button { background: none; border: none; color: var(--primary); font-size: 0.75rem; cursor: pointer; }

        .notif-list { max-height: 400px; overflow-y: auto; }

        .notif-item {
          padding: 1rem;
          border-bottom: 1px solid var(--glass-border);
          display: flex;
          gap: 1rem;
          position: relative;
          transition: var(--transition);
        }

        .notif-item:hover { background: rgba(255,255,255,0.05); }
        .notif-item.unread { background: rgba(124, 58, 237, 0.05); }

        .notif-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(124, 58, 237, 0.1);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notif-body { flex: 1; }
        .notif-body strong { display: block; font-size: 0.875rem; margin-bottom: 0.25rem; }
        .notif-body p { font-size: 0.8125rem; color: var(--text-secondary); margin: 0; }
        .notif-body span { font-size: 0.7rem; color: var(--text-secondary); opacity: 0.7; }

        .delete-notif {
          position: absolute;
          top: 1rem;
          right: 0.5rem;
          opacity: 0;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition);
        }

        .notif-item:hover .delete-notif { opacity: 1; }

        .notif-empty { padding: 3rem 1rem; text-align: center; color: var(--text-secondary); }

        .notif-footer { padding: 0.75rem; border-top: 1px solid var(--glass-border); text-align: center; }
        .notif-footer button { width: 100%; background: none; border: none; color: var(--text-secondary); font-size: 0.8125rem; cursor: pointer; }

        .profile-dropdown {
          position: absolute;
          top: 50px;
          right: 0;
          width: 220px;
          border-radius: 1rem;
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow-lg);
          padding: 1rem;
        }

        .p-header { padding-bottom: 1rem; border-bottom: 1px solid var(--glass-border); margin-bottom: 0.75rem; }
        .p-header strong { display: block; font-size: 0.9375rem; }
        .p-header span { font-size: 0.75rem; color: var(--text-secondary); }

        .p-links { display: flex; flex-direction: column; gap: 0.5rem; }
        .p-links a, .p-links button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem;
          border-radius: 0.5rem;
          text-decoration: none;
          color: var(--text-main);
          font-size: 0.875rem;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          transition: var(--transition);
        }

        .p-links a:hover, .p-links button:hover { background: rgba(255,255,255,0.05); }
        .logout-btn { color: var(--danger) !important; }

        .notification-dot {
          position: absolute;
          top: -5px;
          right: -5px;
          background: var(--danger);
          color: white;
          font-size: 0.625rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
          border: 2px solid var(--bg-main);
        }
      `}} />
    </header>
  );
};

export default TopNav;
