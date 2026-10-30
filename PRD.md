# HireTrack — Project Requirement Document

## 1. Project Title & One-Line Pitch
**HireTrack — Job Application Pipeline & Career CRM:** a private workspace for job seekers to organize applications, interviews, resume versions, and follow-up dates.

## 2. Target User Problem
Job seekers often lose track of application stages, interview dates, recruiter notes, and follow-ups across emails and spreadsheets. HireTrack centralizes that workflow.

## 3. Core Features (MVP)
1. **Authentication and privacy**
   - Acceptance criteria: users can register and log in; API endpoints require a valid JWT; users only see their own applications.
2. **Application pipeline CRUD**
   - Acceptance criteria: create, read, update, and delete applications; required company and role fields are validated; status is selected from a fixed list.
3. **Follow-up and resume tracking**
   - Acceptance criteria: save follow-up/interview dates, notes, and optional resume attachment; invalid file types are rejected by validation where supported.
4. **Search, filter, and dashboard**
   - Acceptance criteria: search company/role and filter by status; dashboard shows current user's application totals by status.

## 4. Data Entities & Schema Relationships
- `User` (Django auth user)
- `JobApplication`: belongs to one `User` via foreign key; fields include company, job title, job URL, status, location, applied date, interview date, follow-up date, resume, notes, timestamps.

## 5. Planned API Endpoints
- `POST /api/auth/register/` → creates user (201)
- `POST /api/auth/token/` → JWT tokens (200)
- `GET/POST /api/applications/` → list/create user's applications (200/201)
- `GET/PUT/PATCH/DELETE /api/applications/<id>/` → detail/update/delete (200/204)
- `GET /api/dashboard/summary/` → status counts (200)

## 6. Key Technical Challenge
Keeping each user's records private while supporting reliable application status transitions, resume uploads, and follow-up date tracking.
