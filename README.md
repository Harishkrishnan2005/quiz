# SkillForge

SkillForge is a full-stack MERN assessment platform for aptitude and technical practice, built with a strict MVC backend and a routed React frontend.

## Stack

- Frontend: React, Redux Toolkit, React Router, Axios, Tailwind CSS, Recharts, React Hook Form, Yup
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Multer, pdf-parse, mammoth, OpenAI

## Structure

```text
frontend/
backend/
```

## Local setup

1. Copy `backend/.env.example` to `backend/.env` and add your MongoDB and JWT values.
2. Copy `frontend/.env.example` to `frontend/.env`.
3. Install dependencies:
   - `cd backend && npm install`
   - `cd frontend && npm install`
4. Seed optional starter data:
   - `cd backend && npm run seed`
5. Start both apps:
   - `cd backend && npm run dev`
   - `cd frontend && npm run dev`

## Default seeded admin

- Workspace: `public`
- Email: `admin@skillforge.dev`
- Password: `Admin1234`

Change these after first login for any non-local environment.
