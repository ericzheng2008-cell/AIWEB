@echo off
chcp 65001 >nul
cls
echo ========================================
echo   测试所有可用网址
echo ========================================
echo.

echo 正在打开所有可能的网址...
echo.

echo [1] 打开网址1...
start https://bucolic-mandazi-fb11e2.netlify.app

timeout /t 2 /nobreak >nul

echo [2] 打开网址2...
start https://magenta-praline-1fbdd7.netlify.app

timeout /t 2 /nobreak >nul

echo [3] 打开本地测试...
start http://localhost:3000

echo.
echo ========================================
echo   已在浏览器中打开所有网址
echo   请查看哪个能正常访问
echo ========================================
echo.
pause
