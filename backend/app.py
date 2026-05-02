import os
from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from models import db, User, Settings
from datetime import timedelta

load_dotenv()


def create_app():
    app = Flask(__name__, static_folder='dist', static_url_path='')

    # -----------------------------
    # Database Configuration
    # -----------------------------
    database_url = os.getenv('DATABASE_URL')

    # Fix for postgres URL (Railway/Heroku compatibility)
    if database_url and database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)

    app.config['SQLALCHEMY_DATABASE_URI'] = database_url or 'sqlite:///taskmanager.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # -----------------------------
    # JWT Configuration
    # -----------------------------
    app.config['JWT_SECRET_KEY'] = os.getenv(
        'JWT_SECRET_KEY',
        'dev-secret-key-change-me-in-prod'
    )
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

    # -----------------------------
    # Initialize Extensions
    # -----------------------------
    db.init_app(app)
    CORS(app)
    jwt = JWTManager(app)

    # -----------------------------
    # Register Blueprints
    # -----------------------------
    from routes.auth import auth_bp
    from routes.projects import project_bp
    from routes.tasks import task_bp
    from routes.dashboard import dashboard_bp
    from routes.notifications import notifications_bp
    from routes.admin import admin_bp
    from routes.files import files_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(project_bp, url_prefix='/api/projects')
    app.register_blueprint(task_bp, url_prefix='/api/tasks')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(files_bp, url_prefix='/api/files')

    # -----------------------------
    # Frontend Serving (React build)
    # -----------------------------
    @app.route('/')
    def serve():
        return send_from_directory(app.static_folder, 'index.html')

    @app.route('/<path:path>')
    def static_proxy(path):
        try:
            return send_from_directory(app.static_folder, path)
        except Exception:
            return send_from_directory(app.static_folder, 'index.html')

    # -----------------------------
    # Error Handlers
    # -----------------------------
    @app.errorhandler(404)
    def not_found(e):
        if request.path.startswith('/api/'):
            return jsonify({"error": "Resource not found"}), 404
        return send_from_directory(app.static_folder, 'index.html')

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Internal server error"}), 500

    # -----------------------------
    # Development-only DB setup
    # -----------------------------
    if os.getenv("ENV", "development") == "development":
        with app.app_context():
            db.create_all()

            # Seed admin user only if not exists
            if not User.query.filter_by(role='admin').first():
                admin = User(
                    username='admin',
                    email='admin@example.com',
                    role='admin',
                    full_name='System Administrator'
                )

                admin_password = os.getenv("ADMIN_PASSWORD", "admin123")
                admin.set_password(admin_password)

                db.session.add(admin)
                db.session.flush()

                db.session.add(Settings(user_id=admin.id))
                db.session.commit()

    return app


# -----------------------------
# Local Development Entry Point
# -----------------------------
if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5000))

    app.run(
        host='0.0.0.0',
        port=port,
        debug=os.getenv('FLASK_DEBUG', 'true').lower() == 'true'
    )
