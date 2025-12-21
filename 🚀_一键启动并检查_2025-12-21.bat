@echo off
chcp 65001 >nul
title 🚀 AIWEB 一键启动并检查 - 2025-12-21

echo.
echo ================================================
echo   🚀 AIWEB 一键启动并检查工具
echo   📅 2025-12-21
echo ================================================
echo.

:: 检查Node.js
echo [1/5] 检查 Node.js 环境...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装或未在PATH中
    echo 💡 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)
node -v
echo ✅ Node.js 环境正常
echo.

:: 检查端口占用
echo [2/5] 检查端口占用情况...
echo.
echo 检查 5173 端口 (前端):
netstat -ano | findstr ":5173" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 端口 5173 已被占用 (前端服务可能在运行)
    set FRONTEND_RUNNING=1
) else (
    echo ⚠️ 端口 5173 空闲 (前端服务未运行)
    set FRONTEND_RUNNING=0
)
echo.

echo 检查 5000 端口 (后端):
netstat -ano | findstr ":5000" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 端口 5000 已被占用 (后端服务可能在运行)
    set BACKEND_RUNNING=1
) else (
    echo ⚠️ 端口 5000 空闲 (后端服务未运行)
    set BACKEND_RUNNING=0
)
echo.

:: 启动服务
echo [3/5] 启动开发服务...
echo.

if %FRONTEND_RUNNING% equ 0 (
    echo 🚀 启动前端服务...
    start "AIWEB-前端服务" cmd /k "cd /d %~dp0 && npm run dev"
    echo ✅ 前端服务已启动
    timeout /t 3 /nobreak >nul
) else (
    echo ✅ 前端服务已在运行
)
echo.

if %BACKEND_RUNNING% equ 0 (
    echo 🚀 启动后端服务...
    start "AIWEB-后端服务" cmd /k "cd /d %~dp0server && node index.js"
    echo ✅ 后端服务已启动
    timeout /t 3 /nobreak >nul
) else (
    echo ✅ 后端服务已在运行
)
echo.

:: 等待服务启动
echo [4/5] 等待服务完全启动...
echo ⏳ 等待 10 秒...
timeout /t 10 /nobreak

:: 打开浏览器和诊断工具
echo.
echo [5/5] 打开浏览器和诊断工具...
echo.
echo 🌐 打开网站: http://localhost:5173
start http://localhost:5173
timeout /t 2 /nobreak >nul

echo 🔍 打开诊断工具...
start 🔍_浏览器完整诊断_2025-12-21.html
echo.

echo ================================================
echo   ✅ 启动完成！
echo ================================================
echo.
echo 📋 接下来的步骤：
echo   1. 等待浏览器打开网站
echo   2. 使用诊断工具检查网页状态
echo   3. 如有问题，查看诊断工具的建议
echo.
echo 💡 提示：
echo   - 前端地址: http://localhost:5173
echo   - 后端地址: http://localhost:5000
echo   - 诊断工具会自动打开
echo.

pause
