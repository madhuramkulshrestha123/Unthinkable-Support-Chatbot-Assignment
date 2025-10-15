@echo off
echo Starting Unthinkable Support Chatbot...

echo Starting backend server...
start "Backend Server" /D "C:\Users\DELL\Documents\GitHub\Assignment\backend" node server.js

echo Starting frontend server...
start "Frontend Server" /D "C:\Users\DELL\Documents\GitHub\Assignment\frontend" node server.js

echo.
echo Servers started!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:3002
echo.
pause