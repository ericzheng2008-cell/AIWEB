@echo off
chcp 65001 >nul
echo ====================================
echo 🚀 启动后端服务器 (端口5000)
echo ====================================
echo.

cd /d "%~dp0server"

echo 📦 检查依赖...
if not exist "node_modules\" (
    echo 正在安装依赖...
    call npm install
)

echo.
echo 🚀 启动后端服务器...
echo.
echo 服务器将运行在: http://localhost:5000
echo API接口: http://localhost:5000/api
echo.
echo 按 Ctrl+C 可停止服务器
echo ====================================
echo.

start "后端服务器 (端口5000)" cmd /k "node index.js"

timeout /t 3 /nobreak >nul

echo.
echo ✅ 后端服务器已在新窗口启动
echo.
echo 现在可以访问前端页面:
echo   http://localhost:3002
echo   或
echo   http://localhost:5173
echo.
pause
