import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import { 
  Plus, 
  Trash2, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  MoreVertical,
  X,
  Search,
  ChevronDown,
  Zap,
  FolderKanban
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { isAdmin, user } = useAuth();
  
  // Form State
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pending', due_date: '', assigned_to: '', project_id: '' });
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchDependencies = async () => {
    if (isAdmin) {
      try {
        const [projRes, userRes] = await Promise.all([api.get('/projects'), api.get('/auth/users')]);
        setProjects(projRes.data);
        setUsers(userRes.data);
      } catch (err) { console.error(err); }
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchDependencies();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      setShowModal(false);
      fetchTasks();
      setNewTask({ title: '', description: '', status: 'pending', due_date: '', assigned_to: '', project_id: '' });
    } catch (err) { alert('Error creating task'); }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/tasks/${id}`, { status });
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const deleteTask = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (err) { console.error(err); }
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.project_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { id: 'pending', title: 'To Do', icon: Clock, color: 'var(--warning)' },
    { id: 'in-progress', title: 'In Progress', icon: Zap, color: 'var(--primary)' },
    { id: 'completed', title: 'Completed', icon: CheckCircle2, color: 'var(--success)' },
  ];



  return (
    <div className="tasks-page animate-fade-in">
      <header className="page-header">
        <div>
          <h1>Task Board</h1>
          <p className="text-secondary">Track and manage team responsibilities in real-time.</p>
        </div>
        <div className="header-actions">
          <div className="search-box glass">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Filter tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {isAdmin && (
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              <Plus size={20} />
              <span>Create Task</span>
            </button>
          )}
        </div>
      </header>

      <div className="kanban-board">
        {columns.map(column => (
          <div key={column.id} className="kanban-column">
            <div className="column-header">
              <div className="column-title">
                <column.icon size={18} style={{ color: column.color }} />
                <h3>{column.title}</h3>
                <span className="count-badge">{filteredTasks.filter(t => t.status === column.id).length}</span>
              </div>
              <button className="icon-btn"><MoreVertical size={16} /></button>
            </div>

            <div className="column-content">
              <AnimatePresence>
                {filteredTasks
                  .filter(task => task.status === column.id)
                  .map((task, i) => (
                    <motion.div 
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                      className="task-card glass-card"
                    >
                      <div className="task-card-header">
                        <span className={`priority-tag ${i % 3 === 0 ? 'high' : i % 3 === 1 ? 'medium' : 'low'}`}>
                          {i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Medium' : 'Low'}
                        </span>
                        {isAdmin && (
                          <button onClick={() => deleteTask(task.id)} className="delete-task">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      
                      <h4>{task.title}</h4>
                      <p>{task.description}</p>
                      
                      <div className="task-footer">
                        <div className="task-info">
                          <div className="info-item">
                            <FolderKanban size={12} />
                            <span>{task.project_name}</span>
                          </div>
                          <div className="info-item">
                            <Calendar size={12} />
                            <span>{task.due_date ? format(new Date(task.due_date), 'MMM dd') : 'No date'}</span>
                          </div>
                        </div>
                        <div className="task-assignee">
                          <div className="mini-avatar" title={task.assignee_name}>
                            {task.assignee_name[0].toUpperCase()}
                          </div>
                        </div>
                      </div>

                      <div className="task-status-control">
                        <select 
                          value={task.status} 
                          onChange={(e) => updateStatus(task.id, e.target.value)}
                        >
                          <option value="pending">Move to To Do</option>
                          <option value="in-progress">Move to In Progress</option>
                          <option value="completed">Move to Completed</option>
                        </select>
                        <ChevronDown size={14} className="select-arrow" />
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
              {filteredTasks.filter(t => t.status === column.id).length === 0 && (
                <div className="empty-column">No tasks in this stage.</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content glass-card"
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>New Task</h2>
                <button onClick={() => setShowModal(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="input-group">
                  <label>Title</label>
                  <input type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required placeholder="Task title" />
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <textarea value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} placeholder="Describe the task..." />
                </div>
                <div className="modal-row">
                  <div className="input-group">
                    <label>Project</label>
                    <select value={newTask.project_id} onChange={e => setNewTask({...newTask, project_id: e.target.value})} required>
                      <option value="">Select Project</option>
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Assigned To</label>
                    <select value={newTask.assigned_to} onChange={e => setNewTask({...newTask, assigned_to: e.target.value})} required>
                      <option value="">Select User</option>
                      {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                    </select>
                  </div>
                </div>
                <div className="input-group">
                  <label>Due Date</label>
                  <input type="date" value={newTask.due_date} onChange={e => setNewTask({...newTask, due_date: e.target.value})} />
                </div>
                
                <div className="modal-footer">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                  <button type="submit" className="btn btn-primary">Create Task</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0 1rem;
          border-radius: 0.75rem;
          border: 1px solid var(--glass-border);
          height: 42px;
        }

        .search-box input {
          border: none;
          background: transparent;
          padding: 0;
          margin: 0;
          width: 150px;
          font-size: 0.875rem;
        }

        .search-box input:focus {
          box-shadow: none;
        }

        .kanban-board {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          align-items: flex-start;
        }

        .kanban-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .column-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 0.5rem;
        }

        .column-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .column-title h3 {
          font-size: 1.125rem;
          margin-bottom: 0;
        }

        .count-badge {
          font-size: 0.75rem;
          padding: 0.15rem 0.6rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
          color: var(--text-secondary);
        }

        .column-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-height: 500px;
        }

        .task-card {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          cursor: pointer;
        }

        .task-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .priority-tag {
          font-size: 0.625rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .priority-tag.high { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
        .priority-tag.medium { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
        .priority-tag.low { background: rgba(16, 185, 129, 0.1); color: var(--success); }

        .delete-task {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          opacity: 0;
          transition: var(--transition);
          cursor: pointer;
        }

        .task-card:hover .delete-task {
          opacity: 1;
        }

        .task-card h4 {
          font-size: 1rem;
          color: var(--text-main);
          line-height: 1.4;
        }

        .task-card p {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .task-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
        }

        .task-info {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.7rem;
          color: var(--text-secondary);
        }

        .task-assignee .mini-avatar {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .task-status-control {
          position: relative;
          margin-top: 0.5rem;
        }

        .task-status-control select {
          height: 32px;
          padding: 0 0.75rem;
          font-size: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          border-radius: 8px;
          appearance: none;
          cursor: pointer;
          color: var(--text-secondary);
          margin-bottom: 0;
        }

        .task-status-control select:hover {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.08);
        }

        .select-arrow {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--text-secondary);
          opacity: 0.5;
        }

        .empty-column {
          padding: 3rem 1rem;
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.8125rem;
          border: 1px dashed var(--border);
          border-radius: 1rem;
        }

        .modal-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 1024px) {
          .kanban-board {
            grid-template-columns: 1fr;
          }
        }
      `}} />
    </div>
  );
};

export default Tasks;
