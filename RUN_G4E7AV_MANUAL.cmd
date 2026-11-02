@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Node.js required for G4E-7AV LOCAL QA.
 pause
 exit /b 1
)
node scripts\launch-g4e7av-manual.mjs
if errorlevel 1 pause
