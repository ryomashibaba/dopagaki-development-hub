@echo off
setlocal EnableExtensions
rem R15S3D11 ISOLATED PRIVATE 6-OF-28 REAL B51 HAZARD RESEARCH - never publishes/deploys.
cd /d "%~dp0\.."
if not exist "package.json" (
  echo [STOP] Please run this from the checked out repository scripts folder.
  pause
  exit /b 1
)
where node >nul 2>&1
if errorlevel 1 (
  echo [STOP] Node.js is not installed or not on PATH.
  pause
  exit /b 1
)
where npm >nul 2>&1
if errorlevel 1 (
  echo [STOP] npm is not on PATH.
  pause
  exit /b 1
)
echo [PRIVATE] Installing local development requirements only...
call npm install --no-save --no-package-lock --no-audit --no-fund
if errorlevel 1 goto :FAILED
echo [PRIVATE] Building EXISTING local game without publishing...
call npm run build:private
if errorlevel 1 goto :FAILED
echo [PRIVATE] Injecting the SOURCE-NATIVE finished R15S3D9 16m B48 x7 into ISOLATED private viewer...
node scripts/p101-r15s3d10-private-real-webgl-pack.mjs
if errorlevel 1 goto :FAILED
echo [PRIVATE] Creating isolated hazard-comparison preview without touching original D10/source...
node scripts/p101-r15s3d11-private-genuine-webgl-hazard-pack.mjs
if errorlevel 1 goto :FAILED
echo [PRIVATE] Starting localhost only; using original renderer/HUD/camera and 6 real B51 reanchors.
echo These two private hazard layouts are RESEARCH ONLY and not human gameplay/art approval.
start "" "http://127.0.0.1:4373/r15s3d11/?r15s3d11=on&stage=R15S3D11-TRUE-PINCH-EDGE"
node scripts/serve.mjs dist-private 4373
if errorlevel 1 goto :FAILED
exit /b 0
:FAILED
echo [FAIL] Preview did not start. No original source, main or public website was changed.
pause
exit /b 1
