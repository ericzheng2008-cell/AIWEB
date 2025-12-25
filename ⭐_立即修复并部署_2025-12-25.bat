@echo off
title Vercel Quick Deploy - One Click Solution
color 0E

cd /d "%~dp0"

cls
echo.
echo ========================================
echo    Vercel Quick Deploy - One Click
echo ========================================
echo.
echo   This is the FASTEST way to deploy!
echo.
echo   What this does:
echo   1. Run diagnostics
echo   2. Fix any issues found
echo   3. Deploy to Vercel
echo.
echo ========================================
echo.
echo Press any key to start...
pause >nul

:: Step 1: Show help page
echo.
echo Opening quick guide...
start "" "🚀_Vercel部署快速通道_2025-12-25.html"
timeout /t 2 >nul

:: Step 2: Run diagnostics
cls
echo.
echo ========================================
echo   Step 1/3: Running Diagnostics
echo ========================================
echo.

call "⚡_诊断Vercel部署问题_2025-12-25.bat"
set DIAG_RESULT=%errorlevel%

if %DIAG_RESULT% NEQ 0 (
    echo.
    echo ========================================
    echo   Issues Found - Running Auto Fix
    echo ========================================
    echo.
    echo Press any key to continue...
    pause >nul
    
    :: Step 3: Run fix
    cls
    echo.
    echo ========================================
    echo   Step 2/3: Auto Fixing Issues
    echo ========================================
    echo.
    
    call "⚡_一键修复Vercel闪退_2025-12-25.bat"
    set FIX_RESULT=%errorlevel%
    
    if %FIX_RESULT% NEQ 0 (
        echo.
        echo ========================================
        echo   Auto Fix Failed
        echo ========================================
        echo.
        echo Please check:
        echo 1. deploy-vercel-log.txt
        echo 2. Run tools manually
        echo.
        pause
        exit /b 1
    )
)

:: Step 4: Deploy
cls
echo.
echo ========================================
echo   Step 3/3: Deploying to Vercel
echo ========================================
echo.
echo Starting deployment...
echo.

call deploy-vercel-simple.bat
set DEPLOY_RESULT=%errorlevel%

if %DEPLOY_RESULT% EQU 0 (
    cls
    echo.
    echo ========================================
    echo   🎉 DEPLOYMENT SUCCESSFUL! 🎉
    echo ========================================
    echo.
    echo Your website is now live on Vercel!
    echo.
    echo Check your terminal for the URL
    echo Or visit: https://vercel.com/dashboard
    echo.
    echo ========================================
    echo.
) else (
    cls
    echo.
    echo ========================================
    echo   ❌ Deployment Failed
    echo ========================================
    echo.
    echo Don't worry! Check these:
    echo.
    echo 1. Open: deploy-vercel-log.txt
    echo 2. Read: 📖_Vercel闪退问题解决指南_2025-12-25.md
    echo 3. Try manual commands
    echo.
    echo ========================================
    echo.
)

echo Press any key to exit...
pause >nul
exit /b %DEPLOY_RESULT%
