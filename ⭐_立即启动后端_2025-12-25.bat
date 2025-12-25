@echo off
chcp 65001 >nul 2>&1
color 0A
title 后端服务器 - 快速启动

echo.
echo   ╔════════════════════════════════════════╗
echo   ║   🚀 后端服务器快速启动               ║
echo   ╚════════════════════════════════════════╝
echo.

:: 释放端口
netstat -ano | findstr :3001 >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 1 >nul
)

:: 启动服务器
cd /d "%~dp0server"
echo   📍 目录: %CD%
echo   🌐 端口: 3001
echo   ⌨️  按 Ctrl+C 停止服务器
echo.
echo   ════════════════════════════════════════
echo.

node index.js

if errorlevel 1 (
    echo.
    echo   ❌ 启动失败！
    echo.
    echo   快速修复: 运行 🔧_一键修复后端闪退_2025-12-25.bat
    echo.
)

pause
