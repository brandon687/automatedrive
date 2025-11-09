#!/bin/bash
# Local test script to simulate Railway deployment
# This tests the exact command Railway will execute

echo "=========================================="
echo "Railway Deployment Local Test"
echo "=========================================="
echo ""

# Check if build exists
if [ ! -d "dist" ]; then
  echo "Error: dist/ directory not found. Running build..."
  npm run build
  echo ""
fi

# Test with a random port (simulating Railway's PORT assignment)
TEST_PORT=8765

echo "Testing startup script with PORT=$TEST_PORT"
echo "This simulates what Railway will do in production"
echo ""

# Start the server in background
PORT=$TEST_PORT ./start-server.sh &
SERVER_PID=$!

# Wait for server to start
echo "Waiting 3 seconds for server to start..."
sleep 3

# Test the server
echo ""
echo "Testing HTTP response..."
if curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:$TEST_PORT; then
  echo ""
  echo "SUCCESS! Server is responding correctly."
  echo "Full response headers:"
  curl -I http://localhost:$TEST_PORT 2>&1 | head -10
else
  echo ""
  echo "FAILED! Server is not responding."
fi

# Cleanup
echo ""
echo "Stopping test server..."
kill $SERVER_PID 2>/dev/null || pkill -f "vite preview"

echo ""
echo "=========================================="
echo "Test Complete"
echo "=========================================="
echo ""
echo "If the test succeeded, you can safely deploy to Railway."
echo "Run: git add . && git commit -m 'Fix deployment' && git push"
