@echo off
chcp 65001 >nul
color 0C
title 紧急修复 - 启动服务器

echo.
echo ========================================
echo   🔧 ERR_CONNECTION_REFUSED 修复
echo ========================================
echo.
echo 错误原因：服务器未启动
echo 解决方案：立即启动开发服务器
echo.
echo ========================================
echo.

cd /d "%~dp0"

echo ✅ 步骤1/4: 检查当前目录
echo 当前目录: %CD%
echo.

echo ✅ 步骤2/4: 检查package.json
if exist package.json (
    echo ✓ package.json 存在
) else (
    echo ✗ package.json 不存在！
    echo 请确认当前目录是否正确
    pause
    exit
)
echo.

echo ✅ 步骤3/4: 检查node_modules
if exist node_modules (
    echo ✓ node_modules 存在
) else (
    echo ✗ node_modules 不存在，正在安装依赖...
    echo.
    npm install
    echo.
    if %errorlevel% neq 0 (
        echo ✗ 依赖安装失败
        pause
        exit
    )
    echo ✓ 依赖安装完成
)
echo.

echo ✅ 步骤4/4: 启动开发服务器
echo.
echo ========================================
echo   正在启动Vite开发服务器...
echo ========================================
echo.
echo ⏳ 请等待编译完成（约15-30秒）
echo 📌 服务器启动后会自动打开浏览器
echo 📌 请勿关闭此窗口
echo.
echo ----------------------------------------
echo.

npm run dev

pause
