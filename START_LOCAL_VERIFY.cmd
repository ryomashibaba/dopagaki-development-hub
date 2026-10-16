@echo off
setlocal
cd /d "%~dp0"
node --test tests\core.test.mjs
if errorlevel 1 (pause & exit /b 1)
node scripts\build.mjs private
if errorlevel 1 (pause & exit /b 1)
node scripts\smoke-http.mjs
pause
