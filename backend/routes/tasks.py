from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from models import db, Task, User, Project
from datetime import datetime
from functools import wraps

task_bp = Blueprint('tasks', __name__)

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get('role') != 'admin':
            return jsonify({"error": "Admin access required"}), 403
        return fn(*args, **kwargs)
    return jwt_required()(wrapper)

@task_bp.route('', methods=['GET'])
@jwt_required()
def get_tasks():
    user_id = int(get_jwt_identity())
    claims = get_jwt()
    
    # Filtering parameters
    status = request.args.get('status')
    project_id = request.args.get('project_id')
    
    query = Task.query
    
    if claims.get('role') != 'admin':
        # Members only see their assigned tasks
        query = query.filter_by(assigned_to=user_id)
    
    if status:
        query = query.filter_by(status=status)
    if project_id:
        query = query.filter_by(project_id=project_id)
        
    tasks = query.all()
    return jsonify([t.to_dict() for t in tasks]), 200

@task_bp.route('', methods=['POST'])
@admin_required
def create_task():
    data = request.get_json()
    
    if not data.get('title') or not data.get('project_id'):
        return jsonify({"error": "Title and Project are required"}), 400

    due_date = None
    if data.get('due_date'):
        due_date = datetime.fromisoformat(data.get('due_date').replace('Z', ''))

    assigned_to = data.get('assigned_to')
    if not assigned_to or str(assigned_to).strip() == '':
        assigned_to = None
    else:
        assigned_to = int(assigned_to)
        
    project_id = data.get('project_id')
    if project_id:
        project_id = int(project_id)

    task = Task(
        title=data.get('title'),
        description=data.get('description'),
        status=data.get('status', 'pending'),
        due_date=due_date,
        assigned_to=assigned_to,
        project_id=project_id
    )
    db.session.add(task)
    db.session.commit()
    return jsonify(task.to_dict()), 201

@task_bp.route('/<int:id>', methods=['PATCH'])
@jwt_required()
def update_task_status(id):
    task = Task.query.get_or_404(id)
    user_id = int(get_jwt_identity())
    claims = get_jwt()
    
    # Check if user has permission (Admin or assigned user)
    if claims.get('role') != 'admin' and task.assigned_to != user_id:
        return jsonify({"error": "Access denied"}), 403
        
    data = request.get_json()
    
    # Admins can update everything, members only status
    if claims.get('role') == 'admin':
        task.title = data.get('title', task.title)
        task.description = data.get('description', task.description)
        task.assigned_to = data.get('assigned_to', task.assigned_to)
        if data.get('due_date'):
            task.due_date = datetime.fromisoformat(data.get('due_date').replace('Z', ''))
            
    task.status = data.get('status', task.status)
    
    db.session.commit()
    return jsonify(task.to_dict()), 200

@task_bp.route('/<int:id>', methods=['DELETE'])
@admin_required
def delete_task(id):
    task = Task.query.get_or_404(id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted"}), 200
