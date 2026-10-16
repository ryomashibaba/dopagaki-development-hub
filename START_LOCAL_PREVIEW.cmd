@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Node.js 22 or later is required.
 pause
 exit /b 1
)
call node scripts\build.mjs private
if errorlevel 1 (pause & exit /b 1)
start "" "http://127.0.0.1:4373/"
node scripts\serve.mjs dist-private 4373
pause
