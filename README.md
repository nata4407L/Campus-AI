# CampusAI

Student academic analytics and study assistant migrated to Node.js (Express + TypeScript + React + Vite).

## Features & Endpoints

- `GET /` and `GET /api/home` — Service status and interactive web dashboard
- `GET /health` and `GET /api/health` — Health check endpoint
- `POST /student/profile` and `POST /api/student/profile` — Create a new student academic profile (`name`, `course`, `semester`, `strong_subject`, `weak_subject`)
- `GET /students` and `GET /api/students` — Retrieve all student profiles (pre-seeded from `campusai.db`)
- `GET /students/:student_id` and `GET /api/students/:student_id` — Retrieve a specific student profile by ID or return 404 if not found

## Running Locally

```bash
npm install
npm run dev
```
