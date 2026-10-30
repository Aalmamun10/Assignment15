# HireTrack — Full-Stack Capstone MVP

HireTrack is a job-application tracker built with Django REST Framework and React + Vite.

## MVP features
- JWT registration/login and protected application routes
- Create, view, edit, and delete job applications
- Track pipeline status, interview dates, follow-up dates, notes, and resume attachments
- Search/filter applications by company, job title, and status
- Dashboard summary cards and responsive UI

## Stack
- Backend: Python, Django, Django REST Framework, Simple JWT, SQLite (development)
- Frontend: React, Vite, React Router, Axios
- File uploads: Django media storage in development

## 1. Run the backend
Use Python 3.10+.

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

API base URL: `http://127.0.0.1:8000/api/`

## 2. Run the frontend
Use Node.js 18+.

Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the URL printed by Vite (usually `http://localhost:5173`).

## 3. Create an account
Use the Register tab in the app. Applications are private to the authenticated user.

## API endpoints
- `POST /api/auth/register/` — register
- `POST /api/auth/token/` — obtain JWT access/refresh tokens
- `POST /api/auth/token/refresh/` — refresh access token
- `GET, POST /api/applications/` — list/create current user's applications
- `GET, PUT, PATCH, DELETE /api/applications/<id>/` — retrieve/update/delete an application
- `GET /api/dashboard/summary/` — current user's counts by status

## Notes before production
This is a development-ready MVP scaffold, not yet a deployed production service. Before public deployment:
- set a strong `DJANGO_SECRET_KEY` environment variable and `DEBUG=False`
- configure `ALLOWED_HOSTS`, HTTPS, secure cookies, CORS/CSRF policy, and production database
- use object storage for uploaded resumes and define upload size/type limits
- add automated tests, logging, backups, rate limiting, and CI/CD
- configure frontend `VITE_API_URL` for the deployed API
- do not commit `.env`, database files, or uploaded resumes

## Handbook milestone mapping
- Class 1: scope and PRD
- Class 2: schema, API routes, component layout
- Class 3: authentication and baseline CRUD
- Class 4: validation and business logic
- Class 5: responsive frontend integration and loading/error states
- Class 6: smoke testing and deployment preparation
- Class 7: live demo and architecture defense
