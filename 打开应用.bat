@echo off
chcp 65001 >nul

echo ========================================
echo   正在打开应用...
echo ========================================
echo.

:: 方式1：使用localhost
start http://localhost:3002/

timeout /t 2 /nobreak >nul

:: 方式2：使用127.0.0.1（备用）
start http://127.0.0.1:3002/

echo.
echo ✅ 已在浏览器中打开以下地址：
echo.
echo    http://localhost:3002/
echo    http://127.0.0.1:3002/
echo.
echo 如果还是无法访问，请确认：
echo 1. 服务器窗口还在运行（不要关闭）
echo 2. 地址拼写正确（localhost，有两个L）
echo.

pause
