from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

# Association table for Project Members (Many-to-Many)
project_members = db.Table('project_members',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('project_id', db.Integer, db.ForeignKey('projects.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='member') # 'admin' or 'member'
    
    # Profile Fields
    full_name = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    department = db.Column(db.String(50))
    employee_id = db.Column(db.String(20))
    join_date = db.Column(db.DateTime, default=datetime.utcnow)
    profile_pic = db.Column(db.String(255)) # URL or path
    
    # Relationships
    assigned_tasks = db.relationship('Task', backref='assignee', lazy=True)
    projects = db.relationship('Project', secondary=project_members, backref=db.backref('members', lazy='dynamic'))
    settings = db.relationship('Settings', backref='user', uselist=False, cascade="all, delete-orphan")
    notifications = db.relationship('Notification', backref='user', lazy='dynamic', cascade="all, delete-orphan")
    activity_logs = db.relationship('ActivityLog', backref='user', lazy='dynamic', cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'full_name': self.full_name,
            'phone': self.phone,
            'department': self.department,
            'employee_id': self.employee_id,
            'join_date': self.join_date.isoformat(),
            'profile_pic': self.profile_pic
        }

class Settings(db.Model):
    __tablename__ = 'settings'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Appearance
    theme_mode = db.Column(db.String(10), default='dark') # 'dark', 'light'
    theme_color = db.Column(db.String(7), default='#7C3AED')
    sidebar_compact = db.Column(db.Boolean, default=False)
    
    # Notifications
    email_notifications = db.Column(db.Boolean, default=True)
    task_reminders = db.Column(db.Boolean, default=True)
    project_updates = db.Column(db.Boolean, default=True)
    deadline_alerts = db.Column(db.Boolean, default=True)
    admin_announcements = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'theme_mode': self.theme_mode,
            'theme_color': self.theme_color,
            'sidebar_compact': self.sidebar_compact,
            'email_notifications': self.email_notifications,
            'task_reminders': self.task_reminders,
            'project_updates': self.project_updates,
            'deadline_alerts': self.deadline_alerts,
            'admin_announcements': self.admin_announcements
        }

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    # Relationships
    tasks = db.relationship('Task', backref='project', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_at': self.created_at.isoformat(),
            'created_by': self.created_by,
            'member_count': self.members.count(),
            'members': [u.to_dict() for u in self.members]
        }

class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending') # pending, in-progress, completed
    priority = db.Column(db.String(10), default='medium') # low, medium, high
    due_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign Keys
    assigned_to = db.Column(db.Integer, db.ForeignKey('users.id'))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'assigned_to': self.assigned_to,
            'assignee_name': self.assignee.username if self.assignee else 'Unassigned',
            'project_id': self.project_id,
            'project_name': self.project.name if self.project else 'Unknown'
        }

class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(20)) # 'task', 'project', 'system'
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'message': self.message,
            'type': self.type,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat()
        }

class ActivityLog(db.Model):
    __tablename__ = 'activity_logs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(255), nullable=False)
    ip_address = db.Column(db.String(45))
    user_agent = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'action': self.action,
            'ip_address': self.ip_address,
            'created_at': self.created_at.isoformat()
        }
