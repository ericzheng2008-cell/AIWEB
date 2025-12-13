@echo off
chcp 65001 >nul
echo ========================================
echo   测试本地开发环境
echo ========================================
echo.

cd /d "%~dp0"

echo [步骤1] 检查 Node.js 版本...
node --version
if errorlevel 1 (
    echo ✗ Node.js 未安装！
    echo 请安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo [步骤2] 检查依赖安装...
if not exist node_modules (
    echo 依赖未安装，正在安装...
    call npm install
)

echo.
echo [步骤3] 启动本地开发服务器...
echo.
echo 浏览器将自动打开 http://localhost:3000
echo 如果本地可以打开，说明代码没问题，部署配置有问题
echo 如果本地也打不开，说明代码本身有问题
echo.
echo 按 Ctrl+C 可以停止服务器
echo.
start http://localhost:3000
call npm run dev
