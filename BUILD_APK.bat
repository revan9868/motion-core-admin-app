@echo off
title Motion Core Admin - Build APK
color 0B
echo ============================================
echo    Motion Core Admin - APK Builder
echo ============================================
echo.

echo [!] Pastikan kamu sudah:
echo   1. Install Node.js (https://nodejs.org)
echo   2. Install EAS CLI: npm install -g eas-cli
echo   3. Login Expo: eas login
echo   4. Set EXPO_TOKEN di GitHub Secrets untuk CI/CD
echo.
echo ============================================
echo Pilih metode build:
echo.
echo [1] EAS Cloud Build (butuh login Expo)
echo [2] Expo Classic Build (butuh login Expo)
echo [3] Open GitHub Actions (triggers cloud build)
echo.
set /p choice="Pilih (1/2/3): "

if "%choice%"=="1" (
    echo.
    echo Running EAS Build...
    cd /d "%~dp0"
    call npx eas build --platform android --profile preview
    echo.
    echo Selesai! APK akan dikirim via EAS.
    pause
)

if "%choice%"=="2" (
    echo.
    echo Running Expo Classic Build...
    cd /d "%~dp0"
    call npx expo build:android
    echo.
    echo Selesai! APK akan dikirim via Expo.
    pause
)

if "%choice%"=="3" (
    echo.
    echo Buka https://github.com/revan9868/motion-core-admin-app/actions
    echo Klik "Build Android APK" -^> "Run workflow"
    echo.
    pause
)
