#!/bin/bash

echo "🚀 Starting DealerTrade Local Development Environment"
echo ""

# Check if node_modules exist
if [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
    echo "⚠️  Dependencies not installed. Installing now..."
    echo ""

    echo "📦 Installing backend dependencies..."
    cd backend && npm install

    echo "📦 Installing frontend dependencies..."
    cd ../frontend && npm install
    cd ..
fi

# Check if database exists
if [ ! -f "backend/prisma/dev.db" ]; then
    echo "🗄️  Setting up database..."
    cd backend
    export DATABASE_URL="file:./dev.db"
    npx prisma generate
    npx prisma migrate dev --name init
    cd ..
fi

echo ""
echo "✅ Environment ready!"
echo ""
echo "📱 Access the app:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3000"
echo ""
echo "📱 To test on mobile:"
echo "   1. Find your local IP: ifconfig | grep 'inet ' | grep -v 127.0.0.1"
echo "   2. Update frontend/.env: VITE_API_URL=http://YOUR_IP:3000/api"
echo "   3. Access from phone: http://YOUR_IP:5173"
echo ""
echo "Starting servers..."
echo ""

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup EXIT INT TERM

# Start backend
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Both servers are running!"
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait
