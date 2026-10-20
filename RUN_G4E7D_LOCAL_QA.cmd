@echo off
setlocal EnableExtensions
title DOPAGAKI G4E-7D localhost HUMAN QA
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo [ERROR] Node.js is required. This launcher never publishes anything.
 pause
 exit /b 1
)
set "DOPAGAKI_G4E6_MANUAL=1"
echo [G4E-7D] Building LOCAL-only real gap candidates. No upload / no deploy.
node scripts/build.mjs private
if errorlevel 1 (
 echo [ERROR] Private build failed. No server started.
 pause
 exit /b 1
)
echo [G4E-7D] Launching localhost on 127.0.0.1:4374 to avoid legacy 4373 conflict.
start "G4E7D LOCAL SERVER" cmd /k node scripts/serve.mjs dist-private 4374
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:4374/drive3d/?g4e6=on&g4e7c=candidate&g4e7d=manual&stage=VB-P101-A13-W9C2-G4E6-C0-55-1"
echo [G4E-7D] Four keyboard-controlled HUMAN runs. No scripted pilot.
echo [G4E-7D] Export JSON manually after trials. No automatic upload.
echo [G4E-7D] Close G4E7D LOCAL SERVER window to stop serving.
exit /b 0
