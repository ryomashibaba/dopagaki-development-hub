@echo off
setlocal
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\BOOTSTRAP_ONCE_PRIVATE_GITHUB.ps1"
if errorlevel 1 (
 echo.
 echo SETUP STOPPED. No deployment will be enabled.
 pause
 exit /b 1
)
pause
