@echo off
title Fix Vercel Deployment Issues
color 0B

cd /d "%~dp0"

echo.
echo ========================================
echo   Vercel Deployment - Auto Fix Tool
echo ========================================
echo.
echo This tool will automatically fix common
echo issues that cause deployment to crash
echo.
echo ========================================
echo.

echo [Step 1/6] Cleaning cache...
echo.

:: Clean dist
if exist dist (
    echo Removing dist folder...
    rmdir /s /q dist 2>nul
    if exist dist (
        echo WARNING - Could not remove dist
        echo Please close any programs using these files
        timeout /t 3 >nul
    ) else (
        echo ✓ dist removed
    )
) else (
    echo ✓ dist already clean
)

:: Clean Vite cache
if exist node_modules\.vite (
    echo Removing Vite cache...
    rmdir /s /q node_modules\.vite 2>nul
    echo ✓ Vite cache cleared
)

:: Clean npm cache
echo Cleaning npm cache...
npm cache clean --force >nul 2>&1
echo ✓ npm cache cleared

timeout /t 2 >nul

echo.
echo [Step 2/6] Checking Node.js...
echo.

node --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Node.js not found
    echo.
    echo Please install Node.js from:
    echo https://nodejs.org
    echo.
    echo Press any key to open download page...
    pause >nul
    start https://nodejs.org
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do (
    echo ✓ Node.js %%i detected
)

timeout /t 1 >nul

echo.
echo [Step 3/6] Installing/Updating Vercel CLI...
echo.

vercel --version >nul 2>&1
if errorlevel 1 (
    echo Installing Vercel CLI...
    call npm install -g vercel
    if errorlevel 1 (
        echo ✗ Failed to install Vercel CLI
        echo.
        echo Please try manually:
        echo npm install -g vercel
        echo.
        pause
        exit /b 1
    )
    echo ✓ Vercel CLI installed
) else (
    echo Updating Vercel CLI...
    call npm install -g vercel@latest >nul 2>&1
    echo ✓ Vercel CLI updated
)

for /f "tokens=*" %%i in ('vercel --version') do (
    echo   Version: %%i
)

timeout /t 1 >nul

echo.
echo [Step 4/6] Fixing package dependencies...
echo.

if exist package-lock.json (
    echo Removing package-lock.json...
    del /f /q package-lock.json 2>nul
    echo ✓ Removed
)

if exist node_modules (
    echo.
    echo Found existing node_modules.
    echo Do you want to reinstall? (Recommended)
    choice /c YN /n /m "(Y=Yes, N=Skip): "
    if errorlevel 2 goto skip_install
    if errorlevel 1 goto do_install
    
    :do_install
    echo.
    echo Removing node_modules...
    rmdir /s /q node_modules 2>nul
    if exist node_modules (
        echo WARNING - Could not remove node_modules
        echo Please close any programs using these files
        timeout /t 3 >nul
    )
)

:skip_install
echo.
echo Installing dependencies...
echo This may take 3-5 minutes...
echo.

call npm install
if errorlevel 1 (
    echo ✗ Installation failed
    echo.
    echo Trying alternative method...
    call npm install --legacy-peer-deps
    if errorlevel 1 (
        echo ✗ Still failed
        echo.
        echo Please check:
        echo 1. Internet connection
        echo 2. npm registry access
        echo 3. Disk space
        echo.
        pause
        exit /b 1
    )
)

echo ✓ Dependencies installed

timeout /t 2 >nul

echo.
echo [Step 5/6] Testing build...
echo.

echo Running test build...
echo This may take 2-5 minutes...
echo.

set NODE_OPTIONS=--max_old_space_size=4096

call npm run build
if errorlevel 1 (
    echo ✗ Build failed
    echo.
    echo Common issues:
    echo 1. Syntax errors in code
    echo 2. Missing dependencies
    echo 3. Memory issues
    echo.
    echo Trying with more memory...
    set NODE_OPTIONS=--max_old_space_size=8192
    call npm run build
    if errorlevel 1 (
        echo ✗ Build still failed
        echo.
        echo Please check your code for errors
        echo.
        pause
        exit /b 1
    )
)

echo ✓ Build successful!

if not exist dist\index.html (
    echo ✗ Build output missing
    echo.
    echo dist/index.html not found
    echo Please check build configuration
    echo.
    pause
    exit /b 1
)

echo ✓ Build output verified

timeout /t 2 >nul

echo.
echo [Step 6/6] Verifying configuration...
echo.

if exist vercel.json (
    echo ✓ vercel.json found
) else (
    echo Creating vercel.json...
    (
        echo {
        echo   "buildCommand": "npm run build",
        echo   "outputDirectory": "dist",
        echo   "framework": "vue",
        echo   "rewrites": [
        echo     {
        echo       "source": "/(.*)",
        echo       "destination": "/index.html"
        echo     }
        echo   ]
        echo }
    ) > vercel.json
    echo ✓ vercel.json created
)

timeout /t 1 >nul

echo.
echo ========================================
echo   ✓ All Fixes Applied Successfully!
echo ========================================
echo.
echo Your environment is now ready for deployment.
echo.
echo Next steps:
echo 1. Run: deploy-vercel-simple.bat
echo 2. Or manually: vercel --prod
echo.
echo If deployment still fails:
echo - Check deploy-vercel-log.txt
echo - Run diagnostic tool
echo - Check internet connection
echo.
echo ========================================
echo.

echo Do you want to deploy now? (Y/N)
choice /c YN /n /m "Press Y or N: "
if errorlevel 2 goto end
if errorlevel 1 goto deploy

:deploy
echo.
echo Starting deployment...
echo.
call deploy-vercel-simple.bat
goto end

:end
echo.
echo Press any key to exit...
pause >nul
exit /b 0
