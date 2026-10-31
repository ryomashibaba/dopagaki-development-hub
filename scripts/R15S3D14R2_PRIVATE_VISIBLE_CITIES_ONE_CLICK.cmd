@echo off
setlocal EnableExtensions
rem R15S3D14R2 PRIVATE 2 CITY STUDY. No public build/deploy/merge.
cd /d "%~dp0\.."
if not exist package.json (
 echo [STOP] Run this command from the correct GitHub checkout.
 pause
 exit /b 1
)
where node >nul 2>&1
if errorlevel 1 goto :NODE
where npm >nul 2>&1
if errorlevel 1 goto :NODE
echo [PRIVATE] Build original local game and all PHYSICAL source B48/B51 stages...
call npm install --no-save --no-package-lock --no-audit --no-fund
if errorlevel 1 goto :FAILED
call npm run build:private
if errorlevel 1 goto :FAILED
node scripts/p101-r15s3d10-private-real-webgl-pack.mjs
if errorlevel 1 goto :FAILED
node scripts/p101-r15s3d11-private-genuine-webgl-hazard-pack.mjs
if errorlevel 1 goto :FAILED
node scripts/p101-r15s3d14-private-original-webgl-crescent-city-pack.mjs
if errorlevel 1 goto :FAILED
node scripts/p101-r15s3d14r1-private-real-habitat-city-webgl2-pack.mjs
if errorlevel 1 goto :FAILED
node scripts/p101-r15s3d14r2-private-real-visible-city-webgl2-pack.mjs
if errorlevel 1 goto :FAILED
echo [PRIVATE] R14R1 baseline and R14R2 A/B real WebGL2. Automatic input is NOT HUMAN QA.
start "" "http://127.0.0.1:4373/r15s3d14r2/?r15s3d14r2=on&stage=R15S3D14R2-TRUE-PINCH-SHORELINE"
node scripts/serve.mjs dist-private 4373
if errorlevel 1 goto :FAILED
exit /b 0
:NODE
echo [STOP] Node.js and npm required on PATH.
pause
exit /b 1
:FAILED
echo [FAIL] Private research viewer did not start. Original game and public website unchanged.
pause
exit /b 1
