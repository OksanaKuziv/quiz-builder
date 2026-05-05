#!/bin/bash

echo "Quiz Builder - Development Setup"
echo "===================================="
echo ""

# Backend setup
echo "Setting up Backend..."
cd backend

if [ ! -f .env ]; then
  cp .env.example .env
  echo "✓ Created backend .env file"
fi

npm install
echo "✓ Backend dependencies installed"

npx prisma generate
echo "✓ Prisma client generated"

npx prisma migrate dev --name init
echo "✓ Database migrations completed"

cd ..

# Frontend setup
echo ""
echo "Setting up Frontend..."
cd frontend

if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "✓ Created frontend .env.local file"
fi

npm install
echo "✓ Frontend dependencies installed"

cd ..

echo ""
echo "Setup complete!"
echo ""
echo "To start the application:"
echo "  1. Backend:  cd backend && npm run dev"
echo "  2. Frontend: cd frontend && npm run dev"
echo ""
echo "Backend will run on: http://localhost:3001"
echo "Frontend will run on: http://localhost:3000"
