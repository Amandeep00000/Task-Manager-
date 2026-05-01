from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models import db, Project, User
from functools import wraps

project_bp = Blueprint('projects', __name__)

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get('role') != 'admin':
            return jsonify({"error": "Admin access required"}), 403
        return fn(*args, **kwargs)
    return jwt_required()(wrapper)

@project_bp.route('', methods=['GET'])
@jwt_required()
def get_projects():
    from flask_jwt_extended import get_jwt_identity
    user_id = int(get_jwt_identity())
    claims = get_jwt()
    
    if claims.get('role') == 'admin':
        projects = Project.query.all()
    else:
        user = User.query.get(user_id)
        projects = user.projects

    # Calculate role-based progress
    from models import Task
    projects_data = []
    for p in projects:
        p_dict = p.to_dict()
        if claims.get('role') == 'admin':
            total_tasks = Task.query.filter_by(project_id=p.id).count()
            completed_tasks = Task.query.filter_by(project_id=p.id, status='completed').count()
        else:
            total_tasks = Task.query.filter_by(project_id=p.id, assigned_to=user_id).count()
            completed_tasks = Task.query.filter_by(project_id=p.id, assigned_to=user_id, status='completed').count()
            
        progress = int((completed_tasks / total_tasks * 100)) if total_tasks > 0 else 0
        p_dict['progress'] = progress
        p_dict['role_view'] = 'Admin (All tasks)' if claims.get('role') == 'admin' else 'Member (My tasks)'
        projects_data.append(p_dict)

    return jsonify(projects_data), 200

@project_bp.route('', methods=['POST'])
@admin_required
def create_project():
    data = request.get_json()
    from flask_jwt_extended import get_jwt_identity
    
    project = Project(
        name=data.get('name'),
        description=data.get('description'),
        created_by=int(get_jwt_identity())
    )
    db.session.add(project)
    db.session.commit()
    return jsonify(project.to_dict()), 201

@project_bp.route('/<int:id>', methods=['PUT'])
@admin_required
def update_project(id):
    project = Project.query.get_or_404(id)
    data = request.get_json()
    
    project.name = data.get('name', project.name)
    project.description = data.get('description', project.description)
    
    db.session.commit()
    return jsonify(project.to_dict()), 200

@project_bp.route('/<int:id>', methods=['DELETE'])
@admin_required
def delete_project(id):
    project = Project.query.get_or_404(id)
    db.session.delete(project)
    db.session.commit()
    return jsonify({"message": "Project deleted"}), 200

@project_bp.route('/<int:id>/members', methods=['POST'])
@admin_required
def add_member(id):
    project = Project.query.get_or_404(id)
    data = request.get_json()
    user_id = data.get('user_id')
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    if user not in project.members:
        project.members.append(user)
        db.session.commit()
        
    return jsonify({"message": "Member added successfully"}), 200

@project_bp.route('/<int:id>/members/<int:user_id>', methods=['DELETE'])
@admin_required
def remove_member(id, user_id):
    project = Project.query.get_or_404(id)
    user = User.query.get(user_id)
    
    if user in project.members:
        project.members.remove(user)
        db.session.commit()
        
    return jsonify({"message": "Member removed successfully"}), 200
