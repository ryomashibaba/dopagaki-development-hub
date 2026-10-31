@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required to run local G4E-7O human QA.
  pause
  exit /b 1
)
node scripts\launch-g4e7o-manual.mjs
if errorlevel 1 (
  echo G4E-7O local launcher failed. Review the error message above.
  pause
)
