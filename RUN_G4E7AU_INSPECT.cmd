@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Node.js is required for G4E-7AU real road2 local test.
 pause
 exit /b 1
)
node scripts\launch-g4e7au-inspect.mjs
if errorlevel 1 (
 echo G4E-7AU localhost QA failed. Review the error above.
 pause
)
