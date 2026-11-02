@echo off
setlocal EnableExtensions
rem R15S3D16 PRIVATE only. The original game, public stage, main/Gold/P100 are protected.
cd /d "%~dp0\.."
if not exist "package.json" (
  echo [STOP] Please run from the repository scripts folder.
  pause
  exit /b 1
)
where node >nul 2>&1
if errorlevel 1 goto :FAILED
where npm >nul 2>&1
if errorlevel 1 goto :FAILED
echo [PRIVATE] Build existing original source once, no public or production deploy...
call npm install --no-save --no-package-lock --no-audit --no-fund
if errorlevel 1 goto :FAILED
call npm run build:private
if errorlevel 1 goto :FAILED
node scripts/p101-r15s3d10-private-real-webgl-pack.mjs
if errorlevel 1 goto :FAILED
node scripts/p101-r15s3d11-private-genuine-webgl-hazard-pack.mjs
if errorlevel 1 goto :FAILED
node scripts/p101-r15s3d15r1-private-true-webgl2-city-pack.mjs
if errorlevel 1 goto :FAILED
node scripts/p101-r15s3d16-private-true-webgl2-civic-heart-pack.mjs
if errorlevel 1 goto :FAILED
echo [PRIVATE] Original WebGL2 240Hz source runner, honest B51 HUD and 2 new city hearts. Gameplay/human/ART still HOLD.
start "" "http://127.0.0.1:4373/r15s3d16/?r15s3d16=on&stage=R15S3D16-TRUE-PINCH-HARBOR"
node scripts/serve.mjs dist-private 4373
if errorlevel 1 goto :FAILED
exit /b 0
:FAILED
echo [STOP] Local isolated preview failed, public source and protected game were not modified.
pause
exit /b 1
