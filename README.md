# Team Task Manager

A production-ready project and task management application built with Flask and React.

## Features

- **Project Management**: Create, update, and delete projects. Manage project members.
- **Task Management**: Create tasks, assign to members, set due dates, and update statuses.
- **Role-Based Access Control**:
  - **Admin**: Full access to all projects and tasks.
  - **Member**: Access to assigned projects and tasks only.
- **Interactive Dashboard**: Real-time stats and data visualization.
- **Secure Authentication**: JWT-based auth with password hashing.

## Tech Stack

- **Backend**: Python Flask, PostgreSQL (SQLAlchemy), Flask-JWT-Extended
- **Frontend**: React.js, Framer Motion, Lucide React, Axios
- **Design**: Modern Glassmorphism UI, Responsive Design

## Getting Started

### Backend Setup

1. Navigate to the `backend` directory.
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. Install dependencies: `pip install -r requirements.txt`
5. Create a `.env` file:
   ```env
   DATABASE_URL=sqlite:///taskmanager.db
   JWT_SECRET_KEY=your-secret-key
   ```
6. Run the app: `python app.py`

### Frontend Setup

1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

## Deployment (Railway)

This project is configured for deployment on Railway.

1. Connect your GitHub repository to Railway.
2. Railway will automatically detect the `Procfile` and use the Python environment.
3. Add a PostgreSQL database service in Railway.
4. Set the following environment variables in the Railway dashboard:
   - `DATABASE_URL`: Automatically provided by Railway when linking the DB.
   - `JWT_SECRET_KEY`: A strong random string.
5. Deployment will trigger automatically on every push.

## Default Admin Credentials
- **Email**: `admin@example.com`
- **Password**: `admin123`
