from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models import db, User, Project, Task, ActivityLog
from functools import wraps

admin_bp = Blueprint('admin', __name__)

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get('role') != 'admin':
            return jsonify({"error": "Admin access required"}), 403
        return fn(*args, **kwargs)
    return jwt_required()(wrapper)

@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_system_stats():
    user_count = User.query.count()
    project_count = Project.query.count()
    task_count = Task.query.count()
    
    # Simple productivity mock
    completed_tasks = Task.query.filter_by(status='completed').count()
    productivity = (completed_tasks / task_count * 100) if task_count > 0 else 0
    
    return jsonify({
        "users": user_count,
        "projects": project_count,
        "tasks": task_count,
        "productivity": round(productivity, 2)
    }), 200

@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_all_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200

@admin_bp.route('/users/<int:id>', methods=['PUT'])
@admin_required
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.get_json()
    
    user.role = data.get('role', user.role)
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    
    db.session.commit()
    return jsonify(user.to_dict()), 200

@admin_bp.route('/users/<int:id>', methods=['DELETE'])
@admin_required
def delete_user(id):
    if id == 1: # Protect primary admin
        return jsonify({"error": "Cannot delete primary administrator"}), 400
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200

@admin_bp.route('/activity', methods=['GET'])
@admin_required
def get_system_activity():
    logs = ActivityLog.query.order_by(ActivityLog.created_at.desc()).limit(50).all()
    return jsonify([{
        **log.to_dict(),
        "username": log.user.username
    } for log in logs]), 200
