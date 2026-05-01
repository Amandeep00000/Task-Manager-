import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import { 
  Plus, 
  Users, 
  Trash2, 
  UserPlus, 
  X, 
  FolderKanban, 
  Calendar, 
  MoreVertical,
  Search,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProj, setNewProj] = useState({ name: '', description: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const { isAdmin } = useAuth();

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    if (isAdmin) {
      try {
        const res = await api.get('/auth/users');
        setAllUsers(res.data);
      } catch (err) { console.error(err); }
    }
  };

  useEffect(() => { 
    fetchProjects(); 
    fetchUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProj);
      setShowModal(false);
      setNewProj({ name: '', description: '' });
      fetchProjects();
    } catch (err) { alert('Error creating project'); }
  };

  const deleteProject = async (id) => {
    if (window.confirm('Delete project and all its tasks?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
      } catch (err) { console.error(err); }
    }
  };

  const addMember = async (userId) => {
    try {
      await api.post(`/projects/${selectedProject.id}/members`, { user_id: userId });
      const updated = await api.get('/projects');
      setProjects(updated.data);
      setSelectedProject(updated.data.find(p => p.id === selectedProject.id));
    } catch (err) { alert('Error adding member'); }
  };

  const removeMember = async (userId) => {
    try {
      await api.delete(`/projects/${selectedProject.id}/members/${userId}`);
      const updated = await api.get('/projects');
      setProjects(updated.data);
      setSelectedProject(updated.data.find(p => p.id === selectedProject.id));
    } catch (err) { alert('Error removing member'); }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="projects-page animate-fade-in">
      <header className="page-header">
        <div>
          <h1>Projects</h1>
          <p className="text-secondary">Manage and collaborate on your team projects.</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus size={20} />
            <span>New Project</span>
          </button>
        )}
      </header>

      <div className="filter-bar glass-card">
        <div className="search-input">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-actions">
          <button className="btn btn-outline">
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="projects-grid">
        <AnimatePresence>
          {filteredProjects.map((proj, i) => (
            <motion.div 
              key={proj.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className="project-card glass-card"
            >
              <div className="project-card-header">
                <div className="project-icon">
                  <FolderKanban size={24} />
                </div>
                <div className="project-actions">
                  {isAdmin && (
                    <div className="action-buttons">
                      <button 
                        className="icon-btn" 
                        onClick={() => { setSelectedProject(proj); setShowMemberModal(true); }}
                        title="Manage Members"
                      >
                        <UserPlus size={18} />
                      </button>
                      <button 
                        className="icon-btn danger" 
                        onClick={() => deleteProject(proj.id)}
                        title="Delete Project"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="project-card-content">
                <h3>{proj.name}</h3>
                <p>{proj.description}</p>
              </div>

              <div className="project-card-footer">
                <div className="project-meta">
                  <div className="meta-item">
                    <Users size={16} />
                    <span>{proj.member_count} Members</span>
                  </div>
                  <div className="meta-item">
                    <Calendar size={16} />
                    <span>Updated 2d ago</span>
                  </div>
                </div>
                <div className="member-avatars">
                  {proj.members?.slice(0, 3).map((m, idx) => (
                    <div key={m.id} className="mini-avatar" style={{ marginLeft: idx > 0 ? '-10px' : '0', zIndex: 3 - idx }}>
                      {m.username[0].toUpperCase()}
                    </div>
                  ))}
                  {proj.member_count > 3 && <div className="more-members">+{proj.member_count - 3}</div>}
                </div>
              </div>
              
              <div className="progress-bar-container">
                <div className="progress-label">
                  <span>Progress <span style={{fontSize: '0.65rem', opacity: 0.6, marginLeft: '0.5rem'}}>{proj.role_view}</span></span>
                  <span>{proj.progress || 0}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${proj.progress || 0}%` }}></div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modals are styled in style tag below */}
      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="modal-content glass-card"
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Create New Project</h2>
                <button onClick={() => setShowModal(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="input-group">
                  <label>Project Name</label>
                  <input type="text" value={newProj.name} onChange={e => setNewProj({...newProj, name: e.target.value})} required placeholder="e.g. Website Redesign" />
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <textarea rows="4" value={newProj.description} onChange={e => setNewProj({...newProj, description: e.target.value})} placeholder="What's this project about?" />
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                  <button type="submit" className="btn btn-primary">Create Project</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showMemberModal && (
          <div className="modal-overlay" onClick={() => setShowMemberModal(false)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="modal-content glass-card wide-modal"
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <h2>Manage Team Members</h2>
                  <p className="text-secondary">Project: {selectedProject.name}</p>
                </div>
                <button onClick={() => setShowMemberModal(false)}><X size={20} /></button>
              </div>
              
              <div className="modal-body">
                <div className="add-member-section">
                  <label>Add New Member</label>
                  <div className="select-wrapper">
                    <select onChange={(e) => { if(e.target.value) addMember(e.target.value); e.target.value = ''; }}>
                      <option value="">Select a user to invite...</option>
                      {allUsers
                        .filter(u => !selectedProject.members?.find(m => m.id === u.id))
                        .map(u => (
                          <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
                        ))
                      }
                    </select>
                  </div>
                </div>

                <div className="member-list-section">
                  <h3>Current Members ({selectedProject.member_count})</h3>
                  <div className="member-list">
                    {selectedProject.members && selectedProject.members.length > 0 ? (
                      selectedProject.members.map(u => (
                        <div key={u.id} className="member-item">
                          <div className="member-profile">
                            <div className="member-avatar-circle">{u.username[0].toUpperCase()}</div>
                            <div className="member-details">
                              <span className="member-name">{u.username}</span>
                              <span className="member-email">{u.email}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeMember(u.id)}
                            className="remove-btn"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="empty-members">No members added yet.</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          margin-bottom: 2rem;
          border-radius: 1rem;
        }

        .search-input {
          position: relative;
          width: 300px;
          display: flex;
          align-items: center;
        }

        .search-input svg {
          position: absolute;
          left: 1rem;
          color: var(--text-secondary);
        }

        .search-input input {
          padding-left: 3rem;
          margin-bottom: 0;
          background: rgba(255, 255, 255, 0.05);
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.5rem;
        }

        .project-card {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .project-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .project-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: rgba(124, 58, 237, 0.1);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .icon-btn.danger:hover {
          background: rgba(239, 68, 68, 0.1);
          color: var(--danger);
        }

        .project-card-content h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          color: var(--text-main);
        }

        .project-card-content p {
          color: var(--text-secondary);
          font-size: 0.9375rem;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .project-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border);
        }

        .project-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .member-avatars {
          display: flex;
          align-items: center;
        }

        .mini-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--primary);
          border: 2px solid var(--bg-card);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
        }

        .more-members {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-left: 0.5rem;
        }

        .progress-bar-container {
          margin-top: 0.5rem;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          margin-bottom: 0.5rem;
          color: var(--text-secondary);
        }

        .progress-track {
          height: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), #4F46E5);
          border-radius: 10px;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
          padding: 1.5rem;
        }

        .modal-content {
          width: 100%;
          max-width: 500px;
          padding: 2.5rem;
          border-radius: 1.5rem;
        }

        .wide-modal {
          max-width: 600px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .modal-header h2 {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }

        .modal-header button {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .modal-footer {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .modal-footer button {
          flex: 1;
        }

        .member-list {
          margin-top: 1rem;
          max-height: 300px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .member-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .member-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .member-avatar-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: white;
          font-size: 0.875rem;
        }

        .member-details {
          display: flex;
          flex-direction: column;
        }

        .member-name {
          font-weight: 600;
          font-size: 0.9375rem;
        }

        .member-email {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .remove-btn {
          background: transparent;
          border: none;
          color: var(--danger);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
        }

        .empty-members {
          padding: 2rem;
          text-align: center;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.02);
          border: 1px dashed var(--border);
          border-radius: 12px;
        }
      `}} />
    </div>
  );
};

export default Projects;
