import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  ClipboardList, 
  LogOut, 
  User as UserIcon, 
  Settings,
  Bell,
  Search,
  ShieldAlert,
  Users
} from 'lucide-react';
import { useAuth } from '../AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/projects', icon: FolderKanban, label: 'Projects' },
    { to: '/tasks', icon: ClipboardList, label: 'Tasks' },
    { to: '/profile', icon: UserIcon, label: 'Profile' },
  ];

  const isCompact = user?.settings?.sidebar_compact;

  return (
    <aside className={`sidebar-container glass ${isCompact ? 'compact' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">T</div>
          {!isCompact && <span className="logo-text">TASKFLOW</span>}
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.to} 
            to={item.to} 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            title={item.label}
          >
            <item.icon size={20} />
            {!isCompact && <span>{item.label}</span>}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <div className="admin-nav-section">
            {!isCompact && <div className="nav-divider">ADMIN</div>}
            <NavLink 
              to="/admin" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              title="Admin Panel"
            >
              <ShieldAlert size={20} />
              {!isCompact && <span>Admin Panel</span>}
            </NavLink>
          </div>
        )}
      </nav>

      <div className="sidebar-footer">
        <Link to="/profile" className="user-profile-mini">
          <div className="user-avatar" title={user?.username}>
            {user?.username?.[0]?.toUpperCase()}
          </div>
          {!isCompact && (
            <div className="user-info">
              <span className="username">{user?.username}</span>
              <span className="role">{user?.role}</span>
            </div>
          )}
        </Link>
        
        <button onClick={logout} className="logout-btn" title="Logout">
          <LogOut size={18} />
          {!isCompact && <span>Logout</span>}
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .sidebar-container {
          width: var(--sidebar-width, 280px);
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          padding: 2rem 1.25rem;
          z-index: 1000;
          border-right: 1px solid var(--glass-border);
        }

        .sidebar-header { margin-bottom: 3rem; }

        .logo-container { display: flex; align-items: center; gap: 1rem; }

        .logo-icon {
          width: 40px; height: 40px;
          background: var(--primary);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: 800; font-size: 1.5rem;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
        }

        .logo-text {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem; font-weight: 700;
          letter-spacing: 1px; color: var(--text-main);
        }

        .sidebar-nav { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }

        .nav-link {
          display: flex; align-items: center; gap: 1rem;
          padding: 0.875rem 1.25rem; color: var(--text-secondary);
          text-decoration: none; border-radius: 1rem;
          font-weight: 500; transition: var(--transition);
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-main);
          transform: translateX(4px);
        }

        .nav-link.active {
          background: rgba(124, 58, 237, 0.15);
          color: var(--primary);
          box-shadow: inset 0 0 0 1px rgba(124, 58, 237, 0.2);
        }

        .admin-nav-section { margin-top: 2rem; }
        .nav-divider {
          font-size: 0.65rem; font-weight: 800;
          color: var(--text-secondary); opacity: 0.5;
          margin-bottom: 0.75rem; padding-left: 1.25rem;
          letter-spacing: 2px;
        }

        .sidebar-footer {
          margin-top: auto; display: flex; flex-direction: column;
          gap: 1.5rem; padding-top: 2rem;
          border-top: 1px solid var(--glass-border);
        }

        .user-profile-mini { display: flex; align-items: center; gap: 1rem; text-decoration: none; }

        .user-avatar {
          width: 44px; height: 44px;
          background: linear-gradient(135deg, var(--primary), #4F46E5);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: 600; font-size: 1.125rem;
        }

        .user-info { display: flex; flex-direction: column; }
        .username { font-weight: 600; color: var(--text-main); font-size: 0.9375rem; }
        .role { font-size: 0.75rem; color: var(--text-secondary); text-transform: capitalize; }

        .logout-btn {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.75rem 1.25rem; color: var(--danger);
          background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.1);
          border-radius: 1rem; font-weight: 600; cursor: pointer;
          transition: var(--transition);
        }

        .logout-btn:hover { background: var(--danger); color: white; transform: translateY(-2px); }

        /* Compact Layout Overrides */
        .sidebar-container.compact { padding: 2rem 0.75rem; align-items: center; }
        .sidebar-container.compact .logo-container { justify-content: center; width: 100%; margin-bottom: 2rem; }
        .sidebar-container.compact .nav-link { justify-content: center; padding: 0.875rem; }
        .sidebar-container.compact .nav-link svg { margin: 0; }
        .sidebar-container.compact .user-profile-mini { justify-content: center; }
        .sidebar-container.compact .logout-btn { justify-content: center; padding: 0.75rem; }
        .sidebar-container.compact .admin-nav-section { display: flex; justify-content: center; }

        @media (max-width: 1024px) { .sidebar-container { display: none; } }
      `}} />
    </aside>
  );
};

export default Sidebar;
