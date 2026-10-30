@echo off
setlocal EnableExtensions
rem R19 A3 genuine physical W9-C1 14m and one private city. No production edits.
cd /d "%~dp0\.."
if not exist "package.json" goto :FAILED
where node >nul 2>&1
if errorlevel 1 goto :FAILED
where npm >nul 2>&1
if errorlevel 1 goto :FAILED
echo [R19A3] Source original 7 B48 / 28 B51 / 240Hz / no teleport / no rescue.
call npm install --no-save --no-package-lock --no-audit --no-fund
if errorlevel 1 goto :FAILED
call npm run build:private
if errorlevel 1 goto :FAILED
node scripts/p101-r19a3-private-original-one-city-pack.mjs
if errorlevel 1 goto :FAILED
echo [R19A3] Launching PRIVATE real W9C1 14m ultra, single-city art ON.
start "DOPAGAKI R19 A3 PRIVATE ORIGINAL SERVER" cmd /k "node scripts/serve.mjs dist-private 4373"
timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:4373/r19a3/?r19a1=on&r19a2Layer=road-hazards-only&r19a3=on&g5b=on&stage=VB-P101-A13-W9C1-ULTRA"
echo [R19A3] Compare OFF using r19a3=off in URL. In page choose real camera and demo for scripted native replay.
echo [R19A3] Human gameplay, Windows FPS, official ART and Slope DNA certification remain HOLD.
exit /b 0
:FAILED
echo [STOP] Local source pack or installation failed. Original/prod untouched.
pause
exit /b 1
