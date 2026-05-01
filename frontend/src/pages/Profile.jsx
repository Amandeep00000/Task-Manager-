import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Palette, 
  Shield, 
  HelpCircle, 
  Camera,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Moon,
  Sun,
  Layout,
  Smartphone,
  LifeBuoy,
  MessageSquare,
  AlertTriangle,
  Fingerprint,
  CheckCircle2,
  Globe,
  Settings,
  Users
} from 'lucide-react';
import { useAuth } from '../AuthContext';

const Profile = () => {
  const { user, logout, updateSettings, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneValue, setPhoneValue] = useState(user?.phone || '');

  const handlePhoneUpdate = async () => {
    const res = await updateProfile({ phone: phoneValue });
    if (res.success) {
      setEditingPhone(false);
    } else {
      alert(res.error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'account', label: 'Account Settings', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy & Access', icon: Shield },
    { id: 'support', label: 'Help & Support', icon: HelpCircle },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="tab-content animate-fade-in">
            <div className="profile-hero glass-card">
              <div className="hero-avatar">
                <div className="avatar-large">{user?.username?.[0]?.toUpperCase()}</div>
                <button className="edit-avatar" title="Change Avatar"><Camera size={16} /></button>
              </div>
              <div className="hero-info">
                <div className="title-row">
                  <h1>{user?.username}</h1>
                  <button className="btn btn-outline btn-sm">Edit Profile</button>
                </div>
                <p className="role-badge">{user?.role}</p>
                <div className="hero-stats">
                  <div className="mini-stat">
                    <span>Joined</span>
                    <strong>May 2024</strong>
                  </div>
                  <div className="mini-stat">
                    <span>Employee ID</span>
                    <strong>#TF-9902</strong>
                  </div>
                  <div className="mini-stat">
                    <span>Projects</span>
                    <strong>12 Active</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-details-grid">
              <div className="details-card glass-card">
                <h3>Contact Information</h3>
                <div className="info-row">
                  <Mail size={18} />
                  <div>
                    <label>Email Address</label>
                    <p>{user?.email}</p>
                  </div>
                </div>
                <div className="info-row">
                  <Phone size={18} />
                  <div>
                    <label>Phone Number</label>
                    <p>{user?.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="info-row">
                  <Globe size={18} />
                  <div>
                    <label>Timezone</label>
                    <p>GMT-5 (Eastern Time)</p>
                  </div>
                </div>
              </div>

              <div className="details-card glass-card">
                <h3>Team & Department</h3>
                <div className="team-row">
                  <div className="team-icon">PE</div>
                  <div>
                    <label>Department</label>
                    <p>Product Engineering</p>
                  </div>
                </div>
                <div className="team-row">
                  <div className="team-icon">TF</div>
                  <div>
                    <label>Team</label>
                    <p>Taskflow Core</p>
                  </div>
                </div>
                <button className="btn btn-outline" style={{ marginTop: '1rem', width: '100%' }}>View Team Directory</button>
              </div>
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="tab-content animate-fade-in">
            <div className="settings-section glass-card">
              <h3>Login & Security</h3>
              <div className="input-group">
                <label>Email Address</label>
                <div className="input-with-action">
                  <input type="email" defaultValue={user?.email} />
                  <button className="btn-inline">Change</button>
                </div>
              </div>
              <div className="input-group">
                <label>Password</label>
                <div className="input-with-action">
                  <input type="password" value="••••••••••••" readOnly />
                  <button className="btn-inline">Update</button>
                </div>
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <div className="input-with-action">
                  {editingPhone ? (
                    <>
                      <input 
                        type="text" 
                        value={phoneValue} 
                        onChange={(e) => setPhoneValue(e.target.value)}
                        placeholder="Enter phone number"
                        autoFocus
                      />
                      <button className="btn-inline" onClick={handlePhoneUpdate}>Save</button>
                      <button className="btn-inline" onClick={() => { setEditingPhone(false); setPhoneValue(user?.phone || ''); }} style={{ color: 'var(--text-secondary)' }}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <input type="text" value={user?.phone || 'Not provided'} readOnly />
                      <button className="btn-inline" onClick={() => setEditingPhone(true)}>Change</button>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="settings-section glass-card" style={{ marginTop: '1.5rem' }}>
              <h3>Multi-Factor Authentication</h3>
              <div className="setting-toggle">
                <div className="toggle-info">
                  <Fingerprint size={20} className="text-primary" />
                  <div>
                    <strong>Two-Factor Authentication (2FA)</strong>
                    <p>Add an extra layer of security to your account.</p>
                  </div>
                </div>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-section glass-card" style={{ marginTop: '1.5rem' }}>
              <h3>Login Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <Globe size={16} />
                  <div className="item-details">
                    <strong>New York, USA • Chrome on Windows</strong>
                    <span>Current Session • 192.168.1.1</span>
                  </div>
                  <span className="status-online">Active</span>
                </div>
                <div className="activity-item">
                  <Smartphone size={16} />
                  <div className="item-details">
                    <strong>San Francisco, USA • App on iPhone 15</strong>
                    <span>2 days ago • 172.16.0.42</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="tab-content animate-fade-in">
            <div className="glass-card">
              <h3>Notification Preferences</h3>
              <p className="text-secondary" style={{ marginBottom: '2rem' }}>Control how you receive updates about your work.</p>
              
              <div className="notifications-list">
                {[
                  { title: 'Email Notifications', desc: 'Receive daily digests and major updates via email.', icon: Mail },
                  { title: 'Task Alerts', desc: 'Get notified when a task is assigned to you or updated.', icon: CheckCircle2 },
                  { title: 'Project Updates', desc: 'Alerts for project status changes and member additions.', icon: Globe },
                  { title: 'Deadline Reminders', desc: 'Critical alerts for tasks approaching their due date.', icon: AlertTriangle },
                  { title: 'Admin Announcements', desc: 'Broadcast messages from organization administrators.', icon: ShieldCheck },
                ].map((n, i) => (
                  <div key={i} className="notification-setting">
                    <div className="n-info">
                      <n.icon size={20} className="text-secondary" />
                      <div>
                        <strong>{n.title}</strong>
                        <p>{n.desc}</p>
                      </div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked={i < 3} />
                      <span className="slider"></span>
                    </label>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Save Preferences</button>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="tab-content animate-fade-in">
            <div className="glass-card">
              <h3>Interface Customization</h3>
              
              <div className="settings-grid">
                <div className="setting-block">
                  <label>Theme Mode</label>
                  <div className="theme-toggle-group">
                    <button 
                      className={`theme-btn ${user?.settings?.theme_mode === 'dark' ? 'active' : ''}`}
                      onClick={() => updateSettings({ theme_mode: 'dark' })}
                    >
                      <Moon size={18} />
                      <span>Dark Mode</span>
                    </button>
                    <button 
                      className={`theme-btn ${user?.settings?.theme_mode === 'light' ? 'active' : ''}`}
                      onClick={() => updateSettings({ theme_mode: 'light' })}
                    >
                      <Sun size={18} />
                      <span>Light Mode</span>
                    </button>
                  </div>
                </div>

                <div className="setting-block">
                  <label>Theme Color</label>
                  <div className="color-grid">
                    {['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'].map(color => (
                      <button 
                        key={color} 
                        className="color-circle" 
                        onClick={() => updateSettings({ theme_color: color })}
                        style={{ 
                          backgroundColor: color, 
                          border: user?.settings?.theme_color === color ? '2px solid white' : 'none',
                          boxShadow: user?.settings?.theme_color === color ? '0 0 0 2px var(--bg-card)' : 'none'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="setting-block">
                  <label>Sidebar Layout</label>
                  <div className="layout-options">
                    <div 
                      className={`layout-opt ${!user?.settings?.sidebar_compact ? 'active' : ''}`}
                      onClick={() => updateSettings({ sidebar_compact: false })}
                    >
                      <Layout size={24} />
                      <span>Standard</span>
                    </div>
                    <div 
                      className={`layout-opt ${user?.settings?.sidebar_compact ? 'active' : ''}`}
                      onClick={() => updateSettings({ sidebar_compact: true })}
                    >
                      <div style={{ width: 12, height: 24, background: 'var(--primary)', borderRadius: 2 }}></div>
                      <span>Compact</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="tab-content animate-fade-in">
            <div className="glass-card">
              <h3>Privacy & Access Control</h3>
              <div className="privacy-item">
                <div className="p-info">
                  <ShieldCheck size={24} className="text-success" />
                  <div>
                    <strong>Role Permissions</strong>
                    <p>Your account is configured with <strong>{user?.role}</strong> permissions.</p>
                  </div>
                </div>
                <button className="btn btn-outline btn-sm">View Details</button>
              </div>

              <div className="privacy-item">
                <div className="p-info">
                  <Users size={24} className="text-primary" />
                  <div>
                    <strong>Team Access</strong>
                    <p>Control who can see your profile and activity.</p>
                  </div>
                </div>
                <select className="inline-select">
                  <option>Everyone</option>
                  <option>Team Only</option>
                  <option>Private</option>
                </select>
              </div>

              <div className="settings-section" style={{ marginTop: '2rem' }}>
                <h3>Active Sessions</h3>
                <div className="session-list">
                  <div className="session-item">
                    <div className="session-meta">
                      <strong>Windows Desktop • Chrome</strong>
                      <span>Last active: Just now</span>
                    </div>
                    <button className="text-danger">Revoke</button>
                  </div>
                  <div className="session-item">
                    <div className="session-meta">
                      <strong>macOS • Safari</strong>
                      <span>Last active: Oct 12, 2024</span>
                    </div>
                    <button className="text-danger">Revoke</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'support':
        return (
          <div className="tab-content animate-fade-in">
            <div className="support-grid">
              <div className="glass-card">
                <h3>Direct Support</h3>
                <div className="support-actions">
                  <button className="support-btn">
                    <MessageSquare size={20} />
                    <span>Live Chat</span>
                  </button>
                  <button className="support-btn">
                    <LifeBuoy size={20} />
                    <span>Open Ticket</span>
                  </button>
                  <button className="support-btn">
                    <Mail size={20} />
                    <span>Email Support</span>
                  </button>
                </div>
              </div>

              <div className="glass-card">
                <h3>Frequently Asked Questions</h3>
                <div className="faq-list">
                  {[
                    'How do I change my workspace?',
                    'Can I invite external members?',
                    'How to export project data?',
                    'Is my data encrypted?'
                  ].map((q, i) => (
                    <div key={i} className="faq-item">
                      <span>{q}</span>
                      <ChevronRight size={16} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card danger-zone-light" style={{ marginTop: '1.5rem' }}>
              <div className="alert-content">
                <AlertTriangle size={20} />
                <div>
                  <strong>Found a bug?</strong>
                  <p>Report technical issues directly to our engineering team.</p>
                </div>
              </div>
              <button className="btn btn-danger btn-sm">Report Issue</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-sidebar glass">
        <div className="sidebar-title">Settings</div>
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={20} />
            <span>{tab.label}</span>
            <ChevronRight size={16} className="arrow" />
          </button>
        ))}
        <button onClick={logout} className="tab-btn logout" style={{ marginTop: 'auto', color: 'var(--danger)' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      <div className="profile-main">
        {renderContent()}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .profile-page {
          display: flex;
          gap: 2rem;
          min-height: calc(100vh - 150px);
        }

        .profile-sidebar {
          width: 300px;
          border-radius: 1.5rem;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          height: fit-content;
          position: sticky;
          top: 100px;
        }

        .sidebar-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          padding-left: 1rem;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          border-radius: 1rem;
          cursor: pointer;
          transition: var(--transition);
          width: 100%;
          font-weight: 500;
          text-align: left;
        }

        .tab-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-main);
        }

        .tab-btn.active {
          background: var(--primary);
          color: white;
        }

        .tab-btn .arrow {
          margin-left: auto;
          opacity: 0.5;
        }

        .profile-main {
          flex: 1;
        }

        /* Hero Section */
        .profile-hero {
          display: flex;
          align-items: center;
          gap: 3rem;
          padding: 3rem;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(79, 70, 229, 0.1));
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .btn-sm {
          padding: 0.4rem 0.8rem;
          font-size: 0.8rem;
        }

        .hero-avatar {
          position: relative;
        }

        .avatar-large {
          width: 120px;
          height: 120px;
          border-radius: 2rem;
          background: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          font-weight: 700;
          color: white;
          box-shadow: 0 20px 40px -10px rgba(124, 58, 237, 0.5);
        }

        .edit-avatar {
          position: absolute;
          bottom: -5px;
          right: -5px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--text-main);
          color: var(--bg-main);
          border: 4px solid var(--bg-card);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .role-badge {
          display: inline-block;
          padding: 0.35rem 1rem;
          background: rgba(124, 58, 237, 0.2);
          color: var(--primary);
          border-radius: 2rem;
          font-weight: 600;
          text-transform: capitalize;
          margin-bottom: 1.5rem;
        }

        .hero-stats {
          display: flex;
          gap: 2rem;
        }

        .mini-stat {
          display: flex;
          flex-direction: column;
        }

        .mini-stat span {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-transform: uppercase;
        }

        .mini-stat strong {
          font-size: 1rem;
          color: var(--text-main);
        }

        /* Profile Details Grid */
        .profile-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .details-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .details-card h3 {
          margin-bottom: 0.5rem;
          border-bottom: 1px solid var(--border);
          padding-bottom: 1rem;
        }

        .info-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .info-row svg {
          color: var(--text-secondary);
        }

        .info-row label {
          display: block;
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .info-row p {
          font-weight: 500;
          color: var(--text-main);
        }

        .team-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .team-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(124, 58, 237, 0.1);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .team-row label {
          display: block;
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .team-row p {
          font-weight: 500;
          color: var(--text-main);
        }

        @media (max-width: 1024px) {
          .profile-details-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Toggles & Switches */
        .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }

        .switch input { opacity: 0; width: 0; height: 0; }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(255, 255, 255, 0.1);
          transition: .4s;
          border-radius: 34px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px; width: 18px;
          left: 3px; bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .slider { background-color: var(--primary); }
        input:checked + .slider:before { transform: translateX(20px); }

        /* Settings Components */
        .input-with-action {
          display: flex;
          gap: 1rem;
        }

        .btn-inline {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--primary);
          padding: 0 1rem;
          border-radius: 0.75rem;
          cursor: pointer;
        }

        .setting-toggle, .notification-setting, .privacy-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 1rem;
          margin-bottom: 0.75rem;
        }

        .toggle-info, .n-info, .p-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .toggle-info p, .n-info p, .p-info p {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .activity-list, .session-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item, .session-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-bottom: 1px solid var(--border);
        }

        .item-details strong, .session-meta strong {
          display: block;
          font-size: 0.9rem;
        }

        .item-details span, .session-meta span {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .status-online {
          margin-left: auto;
          font-size: 0.7rem;
          color: var(--success);
          background: rgba(16, 185, 129, 0.1);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .theme-toggle-group {
          display: flex;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.35rem;
          border-radius: 10px;
        }

        .theme-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.6rem;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .theme-btn.active {
          background: var(--bg-card);
          color: var(--text-main);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .color-grid {
          display: flex;
          gap: 0.75rem;
        }

        .color-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
        }

        .layout-options {
          display: flex;
          gap: 1rem;
        }

        .layout-opt {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          border: 2px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
        }

        .layout-opt.active {
          border-color: var(--primary);
          background: rgba(124, 58, 237, 0.05);
        }

        .support-actions {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .support-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 1rem;
          cursor: pointer;
          color: var(--text-main);
        }

        .support-btn:hover {
          background: rgba(124, 58, 237, 0.05);
          border-color: var(--primary);
        }

        .faq-item {
          display: flex;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
        }

        .danger-zone-light {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: rgba(239, 68, 68, 0.05);
          border-color: rgba(239, 68, 68, 0.2);
        }

        .alert-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: var(--danger);
        }

        .text-success { color: var(--success); }
        .text-primary { color: var(--primary); }
        .text-danger { color: var(--danger); }
        .inline-select { background: transparent; border: 1px solid var(--border); width: auto; margin-bottom: 0; }
      `}} />
    </div>
  );
};

export default Profile;
