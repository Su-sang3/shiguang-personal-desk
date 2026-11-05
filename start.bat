@echo off
setlocal
cd /d "%~dp0"
set PORT=8080
title Shiguang Personal Desk

where python >nul 2>nul
if errorlevel 1 (
  echo Python was not found. Opening index.html directly...
  start "" "%~dp0index.html"
  exit /b 0
)

echo.
echo   Shiguang Personal Desk
echo   http://127.0.0.1:%PORT%/
echo.
echo   The local server is starting in a minimized window.
echo   Close that "Shiguang Server" window to stop it.
echo.

start "Shiguang Server" /min cmd /c "python -m http.server %PORT% --bind 127.0.0.1"
timeout /t 1 /nobreak >nul
start "" "http://127.0.0.1:%PORT%/"

echo   Browser opened. You can close this window.
pause
