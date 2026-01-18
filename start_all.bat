@echo off

echo Stopping any leftover processes...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM python.exe /T 2>nul

echo.
echo ==========================================
echo STARTING PYTHON RAG SERVICE (Port 2001)
echo ==========================================
start "Python RAG Service" cmd /k "cd server\rag_service && .\venv\Scripts\activate && python app.py"

echo.
echo ==========================================
echo STARTING NODE.JS BACKEND (Port 2000)
echo ==========================================
start "Node.js Backend" cmd /k "cd server && npm start"

echo.
echo ==========================================
echo STARTING FRONTEND (Port 2173)
echo ==========================================
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo All services triggered. Please check the 3 new windows.
pause
