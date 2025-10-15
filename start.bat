@echo off
echo Starting Madhuram Customer Support Bot...

echo Starting backend server...
cd backend
start "Backend Server" cmd /k "node server.js"

echo Starting frontend server...
cd ../frontend
start "Frontend Server" cmd /k "serve -p 3000"

echo.
echo Servers started!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:3001
echo.