from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, get_jwt
from models import db, User, Settings, ActivityLog
from datetime import timedelta, datetime

auth_bp = Blueprint('auth', __name__)

def log_activity(user_id, action):
    log = ActivityLog(
        user_id=user_id,
        action=action,
        ip_address=request.remote_addr,
        user_agent=request.user_agent.string
    )
    db.session.add(log)
    db.session.commit()

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(username=data.get('username')).first():
        return jsonify({"error": "Username already exists"}), 400
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({"error": "Email already exists"}), 400

    user = User(
        username=data.get('username'),
        email=data.get('email'),
        role=data.get('role', 'member'),
        full_name=data.get('full_name', data.get('username'))
    )
    user.set_password(data.get('password'))
    
    db.session.add(user)
    db.session.flush() # Get user ID
    
    # Create default settings
    settings = Settings(user_id=user.id)
    db.session.add(settings)
    
    db.session.commit()
    
    log_activity(user.id, "Account registered")
    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()

    if user and user.check_password(data.get('password')):
        access_token = create_access_token(
            identity=str(user.id), 
            additional_claims={"role": user.role},
            expires_delta=timedelta(days=1)
        )
        
        log_activity(user.id, "User logged in")
        
        return jsonify({
            "token": access_token,
            "user": user.to_dict(),
            "settings": user.settings.to_dict() if user.settings else None
        }), 200

    return jsonify({"error": "Invalid email or password"}), 401

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict()), 200

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json()
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    user.full_name = data.get('full_name', user.full_name)
    user.phone = data.get('phone', user.phone)
    user.department = data.get('department', user.department)
    user.employee_id = data.get('employee_id', user.employee_id)
    
    db.session.commit()
    log_activity(user.id, "Profile updated")
    
    return jsonify(user.to_dict()), 200

@auth_bp.route('/settings', methods=['GET'])
@jwt_required()
def get_settings():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user.settings:
        settings = Settings(user_id=user.id)
        db.session.add(settings)
        db.session.commit()
    return jsonify(user.settings.to_dict()), 200

@auth_bp.route('/settings', methods=['PUT'])
@jwt_required()
def update_settings():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json()
    
    if not user.settings:
        user.settings = Settings(user_id=user.id)
        
    for key, value in data.items():
        if hasattr(user.settings, key):
            setattr(user.settings, key, value)
            
    db.session.commit()
    return jsonify(user.settings.to_dict()), 200

@auth_bp.route('/activity', methods=['GET'])
@jwt_required()
def get_activity():
    user_id = get_jwt_identity()
    logs = ActivityLog.query.filter_by(user_id=user_id).order_by(ActivityLog.created_at.desc()).limit(10).all()
    return jsonify([log.to_dict() for log in logs]), 200

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json()
    
    if not user.check_password(data.get('current_password')):
        return jsonify({"error": "Incorrect current password"}), 400
        
    user.set_password(data.get('new_password'))
    db.session.commit()
    log_activity(user.id, "Password changed")
    
    return jsonify({"message": "Password updated successfully"}), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    
    if user:
        # In a real SaaS, generate a token and send an email
        # For now, we'll return success to avoid user enumeration
        pass
        
    return jsonify({"message": "If an account exists with that email, a reset link has been sent."}), 200

@auth_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    claims = get_jwt()
    if claims.get('role') != 'admin':
        return jsonify({"error": "Unauthorized"}), 403
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200
