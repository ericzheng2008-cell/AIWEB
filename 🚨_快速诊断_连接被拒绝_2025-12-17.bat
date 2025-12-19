@echo off
chcp 65001 >nul
color 0E
title 快速诊断 - ERR_CONNECTION_REFUSED

echo.
echo ========================================
echo   🚨 ERR_CONNECTION_REFUSED 诊断
echo ========================================
echo.
echo 错误信息：localhost 拒绝了连接请求
echo 原因分析：服务器未运行
echo.
echo ========================================
echo   🔍 正在诊断...
echo ========================================
echo.

cd /d "%~dp0"

echo [1/6] 检查当前目录
echo    路径: %CD%
echo    ✓ 完成
echo.

echo [2/6] 检查项目文件
if exist package.json (
    echo    ✓ package.json 存在
) else (
    echo    ✗ package.json 不存在
    echo    ⚠️  请确认在正确的项目目录
)

if exist src (
    echo    ✓ src 目录存在
) else (
    echo    ✗ src 目录不存在
)

if exist node_modules (
    echo    ✓ node_modules 存在
) else (
    echo    ✗ node_modules 不存在
    echo    ⚠️  需要运行: npm install
)
echo.

echo [3/6] 检查Node.js环境
node -v >nul 2>&1
if %errorlevel%==0 (
    echo    ✓ Node.js 已安装
    node -v
) else (
    echo    ✗ Node.js 未安装
    echo    ⚠️  请安装Node.js: https://nodejs.org/
)
echo.

echo [4/6] 检查npm
npm -v >nul 2>&1
if %errorlevel%==0 (
    echo    ✓ npm 已安装
    npm -v
) else (
    echo    ✗ npm 未安装
)
echo.

echo [5/6] 检查端口占用
echo    前端端口 (5173):
netstat -ano | findstr ":5173" >nul 2>&1
if %errorlevel%==0 (
    echo    ✓ 端口5173已被占用（服务器可能在运行）
    netstat -ano | findstr ":5173"
) else (
    echo    ✗ 端口5173未被占用（服务器未运行）
)

echo.
echo    后端端口 (3002):
netstat -ano | findstr ":3002" >nul 2>&1
if %errorlevel%==0 (
    echo    ✓ 端口3002已被占用
    netstat -ano | findstr ":3002"
) else (
    echo    ✗ 端口3002未被占用
)
echo.

echo [6/6] 检查防火墙（需手动确认）
echo    ⚠️  请手动检查Windows防火墙设置
echo    路径: 控制面板 → Windows Defender 防火墙
echo.

echo ========================================
echo   📊 诊断结果
echo ========================================
echo.

netstat -ano | findstr ":5173" >nul 2>&1
if %errorlevel%==0 (
    echo ✓ 服务器正在运行
    echo.
    echo 💡 解决方案：
    echo    1. 请访问: http://localhost:5173
    echo    2. 如仍无法访问，请：
    echo       - 清除浏览器缓存 (Ctrl+Shift+Del)
    echo       - 使用无痕模式 (Ctrl+Shift+N)
    echo       - 尝试其他浏览器
) else (
    echo ✗ 服务器未运行
    echo.
    echo 💡 解决方案：
    echo    1. 立即启动服务器
    echo       双击运行: 🔧_紧急修复_启动服务器_2025-12-17.bat
    echo.
    echo    2. 或手动启动:
    echo       npm run dev
    echo.
    echo    3. 如提示依赖问题，先运行:
    echo       npm install
)

echo.
echo ========================================
echo.
pause
