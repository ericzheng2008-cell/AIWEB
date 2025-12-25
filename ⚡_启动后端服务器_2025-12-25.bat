@echo off
chcp 65001 >nul 2>&1
title 后端服务器 - 端口3001
color 0A

echo ========================================
echo   正在启动后端服务器...
echo ========================================
echo.

:: 检查端口占用
netstat -ano | findstr :3001 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  端口3001已被占用，正在释放...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 2 >nul
    echo ✅ 端口已释放
)

cd /d "%~dp0server"

echo 📍 当前目录: %CD%
echo.

:: 检查依赖
if not exist "node_modules" (
    echo ⚠️  依赖未安装，正在安装...
    call npm install
)

echo 🚀 启动后端服务器 (端口 3001)...
echo.

node index.js

if errorlevel 1 (
    echo.
    echo ❌ 服务器启动失败！请查看上方错误信息
    echo.
)

pause
