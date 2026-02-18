#!/bin/bash

# Smart Face Recognition Attendance System - Production Launcher
# Run this script to start backend (and frontend if Node.js is installed)

PROJECT_DIR="/Users/siddhesh/Downloads/PythonProject"

echo "🚀 Starting Smart Face Recognition Attendance System...\n"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Initialize variables
FRONTEND_AVAILABLE=false
FRONTEND_PID=""
BACKEND_PID=""

# Check Python
echo -e "${BLUE}Checking Python installation...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 not found. Please install Python 3.9+${NC}"
    exit 1
fi
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo -e "${GREEN}✅ Python ${PYTHON_VERSION} found${NC}\n"

# Check Node
echo -e "${BLUE}Checking Node.js installation...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js not found - Frontend will not start${NC}"
    echo -e "${YELLOW}Install from: https://nodejs.org/ or brew install node${NC}\n"
    FRONTEND_AVAILABLE=false
else
    NODE_VERSION=$(node --version)
    npm_VERSION=$(npm --version)
    echo -e "${GREEN}✅ Node.js ${NODE_VERSION} and npm ${npm_VERSION} found${NC}\n"
    FRONTEND_AVAILABLE=true
fi

# Start backend
echo -e "${BLUE}Starting Flask Backend...${NC}"
cd "$PROJECT_DIR"
source .venv/bin/activate
# Avoid OpenCV trying to spin macOS main run loop from a background thread
export OPENCV_AVFOUNDATION_SKIP_AUTH=1

# Choose backend port dynamically (prefer 5000)
PREFERRED_BACKEND=5000
if ! lsof -i :${PREFERRED_BACKEND} -sTCP:LISTEN -Pn >/dev/null 2>&1; then
    BACKEND_PORT=${PREFERRED_BACKEND}
else
    BACKEND_PORT=$(python3 - <<'PY'
import socket
s=socket.socket()
s.bind(('',0))
print(s.getsockname()[1])
s.close()
PY
)
    echo -e "${YELLOW}Port ${PREFERRED_BACKEND} is in use, selected free backend port ${BACKEND_PORT}${NC}"
fi
export PORT=${BACKEND_PORT}

python backend_api.py > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID) on port ${BACKEND_PORT}${NC}\n"

# Wait for backend to start
sleep 2

# Check backend health
echo -e "${BLUE}Verifying backend health...${NC}"
if curl -s http://localhost:${BACKEND_PORT}/api/health | grep -q "System is running"; then
    echo -e "${GREEN}✅ Backend is healthy${NC}\n"
else
    echo -e "${YELLOW}⚠️  Backend may not be ready yet - Starting anyway${NC}\n"
fi

# Start frontend if available
if [ "$FRONTEND_AVAILABLE" = true ]; then
        echo -e "${BLUE}Starting React Frontend on port 8080...${NC}"
        cd "$PROJECT_DIR/frontend"
        FRONTEND_PORT=8080
        # If 8080 is in use, do not automatically pick another port — inform user and skip frontend
        if lsof -i :${FRONTEND_PORT} -sTCP:LISTEN -Pn >/dev/null 2>&1; then
            echo -e "${YELLOW}Port ${FRONTEND_PORT} is in use. Skipping frontend start. To run frontend, free port 8080 or start manually with VITE_API_URL=${VITE_API_URL}${NC}\n"
            FRONTEND_PID=""
            FRONTEND_URL="(Frontend not started - port 8080 in use)"
        else
            VITE_API_URL="http://localhost:${BACKEND_PORT}/api"
            PORT=${FRONTEND_PORT} VITE_API_URL=${VITE_API_URL} npm run dev > /tmp/frontend.log 2>&1 &
            FRONTEND_PID=$!
            echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID) on port ${FRONTEND_PORT}${NC}\n"
            FRONTEND_URL="http://localhost:${FRONTEND_PORT}"
        fi
else
    echo -e "${YELLOW}⚠️  Skipping frontend (Node.js not available)${NC}\n"
    FRONTEND_URL="(Frontend not available - install Node.js)"
fi

# Print access information
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  🎓 Smart Face Recognition Attendance System${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}\n"

if [ "$FRONTEND_AVAILABLE" = true ]; then
    echo -e "${BLUE}📍 Access the application at:${NC}"
    echo -e "   ${YELLOW}${FRONTEND_URL}${NC}\n"
else
    echo -e "${RED}⚠️  Frontend not started (Node.js required)${NC}\n"
fi

echo -e "${BLUE}📊 Backend API:${NC}"
echo -e "   ${YELLOW}http://localhost:${BACKEND_PORT}/api${NC}\n"

echo -e "${BLUE}📝 Features:${NC}"
echo -e "   • Student Registration (with face capture)"
echo -e "   • Attendance Marking (with anti-spoofing)"
echo -e "   • Training System (face encoding generation)"
echo -e "   • Student Management"
echo -e "   • Real-time Dashboard\n"

echo -e "${BLUE}📋 Logs:${NC}"
echo -e "   Backend: tail -f /tmp/backend.log"
if [ "$FRONTEND_AVAILABLE" = true ]; then
    echo -e "   Frontend: tail -f /tmp/frontend.log"
fi
echo ""

echo -e "${BLUE}⚠️  To stop the system:${NC}"
echo -e "   Press Ctrl+C to stop all services\n"

echo -e "${GREEN}════════════════════════════════════════════════════════${NC}\n"

# If frontend is not available, show installation instructions
if [ "$FRONTEND_AVAILABLE" = false ]; then
    echo -e "${YELLOW}📦 To enable the frontend, install Node.js:${NC}"
    echo -e "   ${BLUE}macOS (Homebrew):${NC}"
    echo -e "   brew install node"
    echo -e ""
    echo -e "   ${BLUE}Or download from:${NC}"
    echo -e "   https://nodejs.org/\n"
    echo -e "${YELLOW}Then run: npm install && npm run dev${NC}"
    echo -e "   in the frontend directory\n"
fi

# Wait for Ctrl+C
trap "echo -e '\n${YELLOW}Shutting down...${NC}'; [ -n \"$BACKEND_PID\" ] && kill $BACKEND_PID 2>/dev/null; [ -n \"$FRONTEND_PID\" ] && kill $FRONTEND_PID 2>/dev/null; exit" SIGINT

# Wait for backend process (if it exits the script will end)
if [ -n "${BACKEND_PID}" ]; then
    wait ${BACKEND_PID}
fi
