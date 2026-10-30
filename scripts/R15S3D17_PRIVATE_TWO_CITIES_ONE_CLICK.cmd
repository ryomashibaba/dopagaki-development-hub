@echo off
setlocal EnableExtensions
rem R15S3D17 isolated PRIVATE WebGL2 preview only. Never deploy main/Gold/P100/production.
cd /d "%~dp0\.."
if not exist "package.json" goto :FAILED
where node >nul 2>&1
if errorlevel 1 goto :FAILED
where npm >nul 2>&1
if errorlevel 1 goto :FAILED
echo [R17] Build actual original PRIVATE source, base D10/D11 and D15R1 comparison.
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
node scripts/p101-r15s3d17-private-real-webgl2-civic-pack.mjs
if errorlevel 1 goto :FAILED
echo [R17] Launch local source runner. ART/GAMEPLAY/HUMAN and PERFORMANCE remain HOLD.
start "DOPAGAKI R17 PRIVATE SERVER" cmd /k "node scripts/serve.mjs dist-private 4373"
timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:4373/r15s3d17/?r15s3d17=on&stage=R15S3D17-TRUE-PINCH-EXCHANGE"
echo [R17] Browser opened if localhost startup succeeded. Switch modes with stage selector.
exit /b 0
:FAILED
echo [STOP] Private build failed. Public and protected source not modified.
pause
exit /b 1
