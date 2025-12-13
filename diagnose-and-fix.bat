@echo off
chcp 65001 >nul
echo ========================================
echo   完整诊断和修复
echo ========================================
echo.

cd /d "%~dp0"

echo [诊断1] 检查 Node.js...
node --version
if errorlevel 1 (
    echo ✗ Node.js 未安装
    echo 请从 https://nodejs.org/ 下载安装
    pause
    exit /b 1
)
echo ✓ Node.js 已安装

echo.
echo [诊断2] 检查项目文件...
if not exist package.json (
    echo ✗ package.json 不存在
    pause
    exit /b 1
)
echo ✓ package.json 存在

if not exist src (
    echo ✗ src 目录不存在
    pause
    exit /b 1
)
echo ✓ src 目录存在

if not exist index.html (
    echo ✗ index.html 不存在
    pause
    exit /b 1
)
echo ✓ index.html 存在

echo.
echo [修复1] 清理并重新安装依赖...
echo 这可能需要几分钟，请耐心等待...
echo.

if exist node_modules (
    echo 正在删除旧的 node_modules...
    rmdir /s /q node_modules
)

if exist package-lock.json (
    echo 正在删除旧的 package-lock.json...
    del /f /q package-lock.json
)

echo.
echo 正在安装依赖...
call npm install

if errorlevel 1 (
    echo.
    echo ✗ 依赖安装失败！
    echo 请检查网络连接或 npm 源
    echo.
    echo 尝试切换到淘宝镜像：
    echo npm config set registry https://registry.npmmirror.com
    pause
    exit /b 1
)

echo ✓ 依赖安装完成

echo.
echo [修复2] 检查端口占用...
netstat -ano | findstr ":3000" >nul
if not errorlevel 1 (
    echo ⚠ 警告：3000 端口已被占用
    echo 将尝试使用其他端口
)

echo.
echo [修复3] 清理构建缓存...
if exist dist (
    rmdir /s /q dist
    echo ✓ 已清理 dist 目录
)

if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
    echo ✓ 已清理 Vite 缓存
)

echo.
echo ========================================
echo   修复完成！现在启动开发服务器
echo ========================================
echo.
echo 浏览器将自动打开 http://localhost:3000
echo 如果没有自动打开，请手动访问上述地址
echo.
echo 按 Ctrl+C 可以停止服务器
echo.
timeout /t 3 /nobreak >nul
start http://localhost:3000
call npm run dev
