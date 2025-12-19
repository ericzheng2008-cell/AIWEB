@echo off
chcp 65001 >nul
cls
echo.
echo ========================================
echo   AICRM P0 ^& P1 优化测试
echo ========================================
echo.
echo 清理端口...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo.
echo 启动开发服务器...
start "Dev Server" cmd /k "npm run dev"
timeout /t 12 /nobreak
echo.
echo 打开浏览器...
start http://localhost:5173
echo.
echo ========================================
echo 测试完成! 服务器已启动
echo ========================================
pause
