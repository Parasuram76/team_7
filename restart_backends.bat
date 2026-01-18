@echo off

echo Stopping Python RAG Service...
taskkill /F /IM python.exe /T 2>nul || echo Python not running.

echo Stopping Node.js Backend...
taskkill /F /IM node.exe /T 2>nul || echo Node not running.

echo Restarting Python RAG App...
start "Python RAG Service" cmd /k "cd server/rag_service && .\venv\Scripts\activate && python app.py"

echo Restarting Node.js Backend...
start "Node.js Backend" cmd /k "cd server && npm start"

echo Frontend (Vite) should update automatically.
