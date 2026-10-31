@echo off
setlocal EnableExtensions
rem R19 A6 P0 - PRIVATE ONLY. SHA-pinned original five-object GLB readback.
cd /d "%~dp0\.."
if not exist "package.json" goto :FAILED
where node >nul 2>&1
if errorlevel 1 goto :FAILED
where npm >nul 2>&1
if errorlevel 1 goto :FAILED
echo [R19A6] Source original 7 B48 / 28 B51 / 240Hz remains immutable.
if not exist "node_modules\@playwright" (
  call npm install --no-save --no-package-lock --no-audit --no-fund
  if errorlevel 1 goto :FAILED
)
call npm run build:private
if errorlevel 1 goto :FAILED
node scripts/p101-r19a3-private-original-one-city-pack.mjs
if errorlevel 1 goto :FAILED
node scripts/p101-r19a6-private-pinned-glb-scene-pack.mjs
if errorlevel 1 goto :FAILED
echo [R19A6] Launching PRIVATE exact original A5 GLB readback.
start "DOPAGAKI R19A6 PRIVATE GLB" cmd /k "node scripts/serve.mjs dist-private 4373"
timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:4373/r19a6/?r19a1=on&r19a2Layer=road-hazards-only&r19a3=off&r19a6=on&g5b=on&stage=VB-P101-A13-W9C1-ULTRA"
echo [NOTE] This imports PINNED original A5 GLB, NOT an edited Blender city.
echo [NOTE] A5 and A6 art quality remain REJECT; human, FPS, release remain HOLD.
echo [COMPARE] Set r19a6=off and r19a3=on on /r19a3/ to view direct source A5.
exit /b 0
:FAILED
echo [STOP] PRIVATE R19A6 source/pack not ready. Nothing deployed or merged.
pause
exit /b 1
