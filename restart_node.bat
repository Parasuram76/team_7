@echo off

echo Stopping Node.js Backend...
taskkill /F /IM node.exe /T 2>nul
echo.
echo Starting Node.js Backend...
start "Node.js Backend" cmd /k "cd server && npm start"
echo.
echo Node.js Backend restarted.
