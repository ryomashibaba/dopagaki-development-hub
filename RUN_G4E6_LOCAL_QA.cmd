@echo off
setlocal EnableExtensions
title DOPAGAKI G4E-6D local true-gap manual QA
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo [ERROR] Node.js is required. This is a localhost-only manual QA tool.
 pause
 exit /b 1
)
set "DOPAGAKI_G4E6_MANUAL=1"
echo [G4E-6D] Building LOCAL private physics trial. Nothing will be uploaded or published.
node scripts/build.mjs private
if errorlevel 1 (
 echo [ERROR] Private build failed. No server started.
 pause
 exit /b 1
)
echo [G4E-6D] Starting local-only server on 127.0.0.1:4373 ...
start "G4E6 LOCAL SERVER" cmd /k "cd /d ""%~dp0"" && node scripts/serve.mjs dist-private 4373"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:4373/drive3d/?g4e6=on"
echo [G4E-6D] Two HUMAN-HOLD real gap candidates are available in the stage selector.
echo [G4E-6D] Close the G4E6 LOCAL SERVER window to stop localhost access.
echo [G4E-6D] No public deployment, no merge, no automated pilot.
exit /b 0
