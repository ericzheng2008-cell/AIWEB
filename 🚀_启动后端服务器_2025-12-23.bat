@echo off
chcp 65001 > nul
echo.
echo ========================================
echo   启动后端服务器 (端口5000)
echo ========================================
echo.
echo 正在启动后端服务器...
echo.

cd /d "%~dp0server"
start "AIWEB后端服务器" cmd /k "node index.js"

timeout /t 3 /nobreak > nul

echo.
echo ✅ 后端服务器已在新窗口启动
echo.
echo 📌 后端运行在: http://localhost:5000
echo 📌 前端运行在: http://localhost:5173
echo.
echo 按任意键关闭此窗口...
pause > nul
