# Quiz Builder

## Stack
- Frontend: Next.js, TypeScript, Tailwind, React Hook Form, Zod
- Backend: Express, TypeScript, Prisma, SQLite

## Setup

### Backend
```
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

### Frontend
```
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:3001

## Database

SQLite file at `backend/prisma/dev.db`. `DATABASE_URL` is set in `backend/.env` (copied from `.env.example`).

Apply migrations:
```
cd backend
npx prisma migrate dev
```

Inspect data:
```
npx prisma studio
```

## Create a sample quiz

Via UI: open http://localhost:3000/create, enter a title, add questions (True/False, Text Input, or Multiple Choice), submit.

Via API:
```
curl -X POST http://localhost:3001/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sample Quiz",
    "questions": [
      { "type": "boolean", "text": "The sky is blue." },
      { "type": "input", "text": "Name a primary color." },
      { "type": "checkbox", "text": "Pick fruits.", "options": ["Apple", "Carrot", "Banana"] }
    ]
  }'
```

List quizzes: `GET http://localhost:3001/quizzes`
