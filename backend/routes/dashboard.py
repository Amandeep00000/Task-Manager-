from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from models import Task
from datetime import datetime

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    user_id = int(get_jwt_identity())
    claims = get_jwt()
    
    query = Task.query
    if claims.get('role') != 'admin':
        query = query.filter_by(assigned_to=user_id)
        
    tasks = query.all()
    now = datetime.utcnow()
    
    stats = {
        "total": len(tasks),
        "completed": len([t for t in tasks if t.status == 'completed']),
        "pending": len([t for t in tasks if t.status == 'pending']),
        "in_progress": len([t for t in tasks if t.status == 'in-progress']),
        "overdue": len([t for t in tasks if t.due_date and t.due_date < now and t.status != 'completed']),
        "role": claims.get('role')
    }
    
    # Mock productivity for the week based on completed tasks
    # In a real app, this would query tasks completed per day over the last 7 days
    stats["productivity"] = [10, 30, 45, 20, 60, 40, 50]
    
    # Role-based additional data
    if claims.get('role') == 'admin':
        # Admins see top contributors
        from models import User
        users = User.query.all()
        contributors = []
        for u in users:
            if u.role != 'admin':
                u_tasks = Task.query.filter_by(assigned_to=u.id, status='completed').count()
                contributors.append({
                    "name": u.username,
                    "role": u.role,
                    "tasks": u_tasks
                })
        contributors.sort(key=lambda x: x['tasks'], reverse=True)
        stats["contributors"] = contributors[:5]
    else:
        # Members see their recent tasks
        recent = Task.query.filter_by(assigned_to=user_id).order_by(Task.created_at.desc()).limit(5).all()
        stats["recent_tasks"] = [{"title": t.title, "status": t.status, "due_date": t.due_date.isoformat() if t.due_date else None} for t in recent]
        
    return jsonify(stats), 200
