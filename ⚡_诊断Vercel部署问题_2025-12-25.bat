@echo off
title Vercel Deployment Diagnostics
color 0A

cd /d "%~dp0"

echo.
echo ========================================
echo   Vercel Deployment Diagnostics
echo ========================================
echo.
echo Running comprehensive checks...
echo.

:: Check 1: Node.js
echo [1/7] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo   ✗ FAIL - Node.js not installed
    echo     Solution: Install from https://nodejs.org
    set HAS_ERROR=1
) else (
    for /f "tokens=*" %%i in ('node --version') do echo   ✓ OK - Node.js %%i
)

:: Check 2: npm
echo [2/7] Checking npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo   ✗ FAIL - npm not found
    set HAS_ERROR=1
) else (
    for /f "tokens=*" %%i in ('npm --version') do echo   ✓ OK - npm %%i
)

:: Check 3: Vercel CLI
echo [3/7] Checking Vercel CLI...
vercel --version >nul 2>&1
if errorlevel 1 (
    echo   ✗ FAIL - Vercel CLI not installed
    echo     Solution: Run 'npm install -g vercel'
    set HAS_ERROR=1
) else (
    for /f "tokens=*" %%i in ('vercel --version') do echo   ✓ OK - Vercel CLI %%i
)

:: Check 4: package.json
echo [4/7] Checking package.json...
if exist package.json (
    echo   ✓ OK - package.json found
) else (
    echo   ✗ FAIL - package.json missing
    set HAS_ERROR=1
)

:: Check 5: node_modules
echo [5/7] Checking node_modules...
if exist node_modules (
    echo   ✓ OK - node_modules exists
) else (
    echo   ⚠ WARNING - node_modules not found
    echo     Run 'npm install' first
)

:: Check 6: vercel.json
echo [6/7] Checking vercel.json...
if exist vercel.json (
    echo   ✓ OK - vercel.json found
) else (
    echo   ⚠ WARNING - vercel.json not found
    echo     This is optional
)

:: Check 7: Disk space
echo [7/7] Checking disk space...
for /f "tokens=3" %%a in ('dir /-c ^| find "bytes free"') do set FREE_SPACE=%%a
echo   ℹ Free space: %FREE_SPACE% bytes

echo.
echo ========================================
echo   Diagnostic Summary
echo ========================================
echo.

if defined HAS_ERROR (
    echo Status: ✗ ISSUES FOUND
    echo.
    echo Please fix the issues above before deploying.
    echo.
) else (
    echo Status: ✓ ALL CHECKS PASSED
    echo.
    echo Your environment is ready for deployment!
    echo.
    echo Next steps:
    echo 1. Run deploy-vercel-simple.bat
    echo 2. If it still crashes, check deploy-vercel-log.txt
    echo.
)

echo ========================================
echo.

:: Check if previous deployment log exists
if exist deploy-vercel-log.txt (
    echo.
    echo Previous deployment log found.
    echo Do you want to view it? (Y/N)
    choice /c YN /n /m "Press Y or N: "
    if errorlevel 2 goto skip_log
    if errorlevel 1 goto show_log
    
    :show_log
    echo.
    echo Opening log file...
    notepad deploy-vercel-log.txt
    goto end
    
    :skip_log
    echo.
    echo Skipped log viewing.
)

:end
echo.
echo Press any key to exit...
pause >nul
