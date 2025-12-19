@echo off
chcp 65001 >nul
color 0A
title 启动前端服务器 (Vite)

echo.
echo ========================================
echo   🎨 启动前端服务器
echo ========================================
echo.
echo ✅ 后端服务器已运行 (端口3002)
echo 🔄 正在启动前端服务器 (端口5173)
echo.
echo ========================================
echo.

cd /d "%~dp0"

echo 📦 检查依赖...
if not exist node_modules (
    echo ⚠️  node_modules 不存在，正在安装依赖...
    npm install
    if %errorlevel% neq 0 (
        echo ✗ 依赖安装失败
        pause
        exit
    )
)

echo ✓ 依赖检查完成
echo.
echo ========================================
echo   正在启动 Vite 开发服务器...
echo ========================================
echo.
echo 📌 服务器信息：
echo    - 前端地址：http://localhost:5173
echo    - 后端地址：http://localhost:3002
echo.
echo ⏳ 编译中，请稍候（约15-30秒）...
echo 📌 编译完成后浏览器会自动打开
echo 📌 请勿关闭此窗口！
echo.
echo ----------------------------------------
echo.

npm run dev

pause
