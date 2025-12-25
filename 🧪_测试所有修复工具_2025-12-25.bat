@echo off
title Test All Vercel Tools
color 0A

cd /d "%~dp0"

cls
echo.
echo ========================================
echo   Vercel Tools - Complete Test
echo ========================================
echo.
echo This will test all Vercel deployment tools
echo to ensure everything works correctly.
echo.
echo Tests to run:
echo 1. Check all files exist
echo 2. Test diagnostic tool
echo 3. Verify documentation
echo 4. Check HTML page
echo.
echo ========================================
echo.
echo Press any key to start testing...
pause >nul

:: Test Results
set PASS=0
set FAIL=0

cls
echo.
echo ========================================
echo   Test 1/4: File Existence Check
echo ========================================
echo.

echo Checking core files...
echo.

:: Check BAT files
if exist "deploy-vercel-simple.bat" (
    echo [PASS] deploy-vercel-simple.bat
    set /a PASS+=1
) else (
    echo [FAIL] deploy-vercel-simple.bat NOT FOUND
    set /a FAIL+=1
)

if exist "⚡_诊断Vercel部署问题_2025-12-25.bat" (
    echo [PASS] ⚡_诊断Vercel部署问题_2025-12-25.bat
    set /a PASS+=1
) else (
    echo [FAIL] ⚡_诊断Vercel部署问题_2025-12-25.bat NOT FOUND
    set /a FAIL+=1
)

if exist "⚡_一键修复Vercel闪退_2025-12-25.bat" (
    echo [PASS] ⚡_一键修复Vercel闪退_2025-12-25.bat
    set /a PASS+=1
) else (
    echo [FAIL] ⚡_一键修复Vercel闪退_2025-12-25.bat NOT FOUND
    set /a FAIL+=1
)

if exist "⭐_立即修复并部署_2025-12-25.bat" (
    echo [PASS] ⭐_立即修复并部署_2025-12-25.bat
    set /a PASS+=1
) else (
    echo [FAIL] ⭐_立即修复并部署_2025-12-25.bat NOT FOUND
    set /a FAIL+=1
)

echo.
echo Checking documentation files...
echo.

:: Check MD files
if exist "📖_Vercel闪退问题解决指南_2025-12-25.md" (
    echo [PASS] 📖_Vercel闪退问题解决指南_2025-12-25.md
    set /a PASS+=1
) else (
    echo [FAIL] 📖_Vercel闪退问题解决指南_2025-12-25.md NOT FOUND
    set /a FAIL+=1
)

if exist "✅_Vercel闪退修复完成_2025-12-25.md" (
    echo [PASS] ✅_Vercel闪退修复完成_2025-12-25.md
    set /a PASS+=1
) else (
    echo [FAIL] ✅_Vercel闪退修复完成_2025-12-25.md NOT FOUND
    set /a FAIL+=1
)

if exist "README_Vercel闪退问题已解决_2025-12-25.md" (
    echo [PASS] README_Vercel闪退问题已解决_2025-12-25.md
    set /a PASS+=1
) else (
    echo [FAIL] README_Vercel闪退问题已解决_2025-12-25.md NOT FOUND
    set /a FAIL+=1
)

if exist "📋_Vercel闪退修复交付清单_2025-12-25.md" (
    echo [PASS] 📋_Vercel闪退修复交付清单_2025-12-25.md
    set /a PASS+=1
) else (
    echo [FAIL] 📋_Vercel闪退修复交付清单_2025-12-25.md NOT FOUND
    set /a FAIL+=1
)

echo.
echo Checking HTML file...
echo.

if exist "🚀_Vercel部署快速通道_2025-12-25.html" (
    echo [PASS] 🚀_Vercel部署快速通道_2025-12-25.html
    set /a PASS+=1
) else (
    echo [FAIL] 🚀_Vercel部署快速通道_2025-12-25.html NOT FOUND
    set /a FAIL+=1
)

timeout /t 2 >nul

cls
echo.
echo ========================================
echo   Test 2/4: Diagnostic Tool Test
echo ========================================
echo.
echo Running diagnostic tool...
echo This will check your environment.
echo.
echo Press any key to continue...
pause >nul

echo.
echo Launching diagnostic tool...
echo (Close it when done)
echo.
timeout /t 2 >nul

start /wait cmd /c "⚡_诊断Vercel部署问题_2025-12-25.bat"

echo.
echo Did the diagnostic tool run successfully? (Y/N)
choice /c YN /n /m "Press Y or N: "
if errorlevel 2 (
    echo [FAIL] Diagnostic tool failed
    set /a FAIL+=1
) else (
    echo [PASS] Diagnostic tool works
    set /a PASS+=1
)

timeout /t 1 >nul

cls
echo.
echo ========================================
echo   Test 3/4: Documentation Check
echo ========================================
echo.
echo Checking if documentation can be opened...
echo.

echo Testing Markdown file access...
notepad "README_Vercel闪退问题已解决_2025-12-25.md"

echo.
echo Did the README file open successfully? (Y/N)
choice /c YN /n /m "Press Y or N: "
if errorlevel 2 (
    echo [FAIL] Documentation access failed
    set /a FAIL+=1
) else (
    echo [PASS] Documentation accessible
    set /a PASS+=1
)

timeout /t 1 >nul

cls
echo.
echo ========================================
echo   Test 4/4: HTML Page Test
echo ========================================
echo.
echo Opening HTML quick guide...
echo.

start "" "🚀_Vercel部署快速通道_2025-12-25.html"

timeout /t 2 >nul

echo.
echo Did the HTML page open in your browser? (Y/N)
choice /c YN /n /m "Press Y or N: "
if errorlevel 2 (
    echo [FAIL] HTML page failed
    set /a FAIL+=1
) else (
    echo [PASS] HTML page works
    set /a PASS+=1
)

:: Calculate results
set /a TOTAL=%PASS%+%FAIL%
set /a PERCENT=(%PASS%*100)/%TOTAL%

cls
echo.
echo ========================================
echo   Test Results Summary
echo ========================================
echo.
echo Total Tests: %TOTAL%
echo Passed: %PASS%
echo Failed: %FAIL%
echo Success Rate: %PERCENT%%%
echo.
echo ----------------------------------------
echo.

if %FAIL% EQU 0 (
    echo Status: ✓ ALL TESTS PASSED!
    echo.
    echo All Vercel deployment tools are working
    echo correctly and ready to use.
    echo.
    echo Next steps:
    echo 1. Read: README_Vercel闪退问题已解决_2025-12-25.md
    echo 2. Run: ⭐_立即修复并部署_2025-12-25.bat
    echo 3. Or: deploy-vercel-simple.bat
) else (
    echo Status: ✗ SOME TESTS FAILED
    echo.
    echo Please check the failed items above.
    echo Make sure all files are in the correct location.
    echo.
    echo If files are missing, please restore them.
)

echo.
echo ========================================
echo.

echo Press any key to exit...
pause >nul

exit /b 0
