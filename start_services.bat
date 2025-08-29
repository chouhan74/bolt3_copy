@echo off
echo Starting Mercer HR Assessment Platform Services...

REM Change to project directory
cd /d E:\bolt3_copy\project

echo Starting Redis...
start "" "..\redis-server.exe"

echo Starting API server...
start "" uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

echo Starting RQ SimpleWorker...
start "" python run_worker.py

echo.
echo All services started!
echo Web Server: http://localhost:8000
echo.
echo Press any key to close this window...
pause > nul
