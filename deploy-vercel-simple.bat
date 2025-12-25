@echo off
title AIWEB - Vercel Deploy (Anti-Flash)

cd /d "%~dp0"
setlocal EnableDelayedExpansion

:: 创建日志文件
set LOG_FILE=%~dp0deploy-vercel-log.txt
echo. > "%LOG_FILE%"
echo ======================================== >> "%LOG_FILE%"
echo Vercel Deployment Log - %date% %time% >> "%LOG_FILE%"
echo ======================================== >> "%LOG_FILE%"
echo. >> "%LOG_FILE%"

echo.
echo ========================================
echo   AIWEB - Vercel Deployment Tool
echo   (Anti-Flash Protection Enabled)
echo ========================================
echo.
echo   This tool will:
echo   1. Clean old files
echo   2. Check environment
echo   3. Install dependencies
echo   4. Build project
echo   5. Deploy to Vercel
echo.
echo   Log file: deploy-vercel-log.txt
echo ========================================
echo.

:: Step 1: Clean
echo.
echo [1/5] Cleaning old files...
echo [1/5] Cleaning old files... >> "%LOG_FILE%"
echo.

if exist dist (
    rmdir /s /q dist 2>nul
    if exist dist (
        echo WARNING - Failed to remove dist folder >> "%LOG_FILE%"
        echo WARNING - Failed to remove dist folder
    ) else (
        echo OK - dist removed
        echo OK - dist removed >> "%LOG_FILE%"
    )
)

if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite 2>nul
    echo OK - vite cache cleared
    echo OK - vite cache cleared >> "%LOG_FILE%"
)

timeout /t 1 >nul

:: Step 2: Check environment
echo.
echo [2/5] Checking environment...
echo [2/5] Checking environment... >> "%LOG_FILE%"
echo.

node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR - Node.js not installed >> "%LOG_FILE%"
    echo.
    echo ========================================
    echo   ERROR - Node.js Not Found
    echo ========================================
    echo.
    echo Please install Node.js from:
    echo https://nodejs.org
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
echo OK - Node.js %NODE_VER%
echo OK - Node.js %NODE_VER% >> "%LOG_FILE%"

vercel --version >nul 2>&1
if errorlevel 1 (
    echo Vercel CLI not found, installing... >> "%LOG_FILE%"
    echo Installing Vercel CLI...
    echo This may take 1-2 minutes...
    call npm install -g vercel >> "%LOG_FILE%" 2>&1
    if errorlevel 1 (
        echo ERROR - Failed to install Vercel CLI >> "%LOG_FILE%"
        echo.
        echo ========================================
        echo   ERROR - Vercel CLI Install Failed
        echo ========================================
        echo.
        echo Please run manually: npm install -g vercel
        echo.
        echo Press any key to exit...
        pause >nul
        exit /b 1
    )
)
for /f "tokens=*" %%i in ('vercel --version') do set VERCEL_VER=%%i
echo OK - Vercel CLI %VERCEL_VER%
echo OK - Vercel CLI %VERCEL_VER% >> "%LOG_FILE%"

timeout /t 1 >nul

:: Step 3: Install dependencies
echo.
echo [3/5] Installing dependencies...
echo [3/5] Installing dependencies... >> "%LOG_FILE%"
echo.

if not exist node_modules (
    echo Installing... (3-5 minutes)
    echo Running: npm install >> "%LOG_FILE%"
    call npm install >> "%LOG_FILE%" 2>&1
    if errorlevel 1 (
        echo ERROR - Install failed, check log file >> "%LOG_FILE%"
        echo.
        echo ========================================
        echo   ERROR - npm install Failed
        echo ========================================
        echo.
        echo Check deploy-vercel-log.txt for details
        echo.
        echo Common solutions:
        echo 1. Delete node_modules and try again
        echo 2. Run: npm cache clean --force
        echo 3. Check your internet connection
        echo.
        echo Press any key to exit...
        pause >nul
        exit /b 1
    )
) else (
    echo Updating packages... >> "%LOG_FILE%"
    call npm install >> "%LOG_FILE%" 2>&1
)
echo OK - Dependencies ready
echo OK - Dependencies ready >> "%LOG_FILE%"

timeout /t 1 >nul

:: Step 4: Build
echo.
echo [4/5] Building project...
echo [4/5] Building project... >> "%LOG_FILE%"
echo This may take 2-5 minutes...
echo.

set NODE_OPTIONS=--max_old_space_size=4096
echo NODE_OPTIONS=%NODE_OPTIONS% >> "%LOG_FILE%"

echo Running: npm run build >> "%LOG_FILE%"
call npm run build >> "%LOG_FILE%" 2>&1

if errorlevel 1 (
    echo ERROR - Build failed, check log file >> "%LOG_FILE%"
    echo.
    echo ========================================
    echo   ERROR - Build Failed
    echo ========================================
    echo.
    echo Build errors detected!
    echo.
    echo Check deploy-vercel-log.txt for details
    echo.
    echo Common issues:
    echo 1. Syntax errors in Vue files
    echo 2. Missing dependencies
    echo 3. Memory issues (try closing other apps)
    echo.
    echo Opening log file...
    timeout /t 2 >nul
    notepad "%LOG_FILE%"
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

if not exist dist\index.html (
    echo ERROR - dist/index.html not found after build >> "%LOG_FILE%"
    echo.
    echo ========================================
    echo   ERROR - Build Output Missing
    echo ========================================
    echo.
    echo Build completed but dist/index.html not found
    echo.
    echo Check deploy-vercel-log.txt for details
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

echo OK - Build successful!
echo OK - Build successful! >> "%LOG_FILE%"
timeout /t 2 >nul

:: Step 5: Deploy
echo.
echo [5/5] Deploying to Vercel...
echo [5/5] Deploying to Vercel... >> "%LOG_FILE%"
echo.

echo ----------------------------------------
echo   IMPORTANT: Browser Authentication
echo ----------------------------------------
echo.
echo A browser window will open for login
echo Please authorize in the browser
echo.
echo If browser doesn't open:
echo 1. Copy the URL from the terminal
echo 2. Open it manually in your browser
echo.
echo Press any key to start login...
pause >nul

echo Running: vercel login >> "%LOG_FILE%"
vercel login >> "%LOG_FILE%" 2>&1

if errorlevel 1 (
    echo ERROR - Login failed >> "%LOG_FILE%"
    echo.
    echo ========================================
    echo   ERROR - Vercel Login Failed
    echo ========================================
    echo.
    echo Login failed. Please try:
    echo 1. Check your internet connection
    echo 2. Manually run: vercel login
    echo 3. Visit: https://vercel.com
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

echo.
echo ----------------------------------------
echo   Starting Deployment
echo ----------------------------------------
echo.
echo Deploying to production...
echo This may take 2-5 minutes
echo.
echo Please wait...
echo.

echo Running: vercel --prod >> "%LOG_FILE%"
vercel --prod >> "%LOG_FILE%" 2>&1

if errorlevel 1 (
    echo ERROR - Deployment failed >> "%LOG_FILE%"
    echo.
    echo ========================================
    echo   ERROR - Vercel Deployment Failed
    echo ========================================
    echo.
    echo Deployment failed!
    echo.
    echo Check deploy-vercel-log.txt for details
    echo.
    echo Common issues:
    echo 1. Network connection problems
    echo 2. Vercel account not configured
    echo 3. Project name conflicts
    echo.
    echo Opening log file...
    timeout /t 2 >nul
    notepad "%LOG_FILE%"
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

:: Success
echo. >> "%LOG_FILE%"
echo ======================================== >> "%LOG_FILE%"
echo SUCCESS - Deployment completed! >> "%LOG_FILE%"
echo ======================================== >> "%LOG_FILE%"

echo.
echo ========================================
echo   ✓ SUCCESS - Deployment Complete!
echo ========================================
echo.
echo Your site is now live on Vercel!
echo.
echo Next steps:
echo 1. Visit the URL shown above
echo 2. Check Vercel Dashboard: https://vercel.com/dashboard
echo 3. Configure custom domain (optional)
echo.
echo Log saved to: deploy-vercel-log.txt
echo.
echo ========================================
echo.

echo Press any key to exit...
pause >nul
exit /b 0
