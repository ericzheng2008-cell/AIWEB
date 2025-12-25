@echo off
chcp 65001 >nul
echo ========================================
echo    启动后端服务器 (Port 5000)
echo ========================================
echo.

cd /d "%~dp0server"

echo [1/2] 检查后端依赖...
if not exist "node_modules\" (
    echo 正在安装后端依赖...
    call npm install
)

echo.
echo [2/2] 启动后端服务器...
echo.
echo ✅ 后端服务器启动中...
echo 📍 地址: http://localhost:5000
echo.
echo ⚠️  请保持此窗口运行，不要关闭！
echo.

node index.js

pause
