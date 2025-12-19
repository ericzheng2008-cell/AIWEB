@echo off
chcp 65001 >nul
color 0E
title 检查端口占用情况

echo.
echo ========================================
echo   🔍 检查端口占用情况
echo ========================================
echo.

echo 检查前端端口 (5173)...
netstat -ano | findstr ":5173"
if %errorlevel%==0 (
    echo ✅ 端口5173已被占用
) else (
    echo ❌ 端口5173未被占用
)

echo.
echo ----------------------------------------
echo.

echo 检查后端端口 (3002)...
netstat -ano | findstr ":3002"
if %errorlevel%==0 (
    echo ✅ 端口3002已被占用
) else (
    echo ❌ 端口3002未被占用
)

echo.
echo ========================================
echo   📊 所有监听端口
echo ========================================
echo.
netstat -ano | findstr "LISTENING" | findstr ":5173 :3002 :3000 :8080"

echo.
echo ========================================
echo   💡 说明
echo ========================================
echo.
echo 端口5173 - 前端开发服务器 (Vite)
echo 端口3002 - 后端API服务器 (Express)
echo.
echo 如需关闭占用端口的进程：
echo 1. 找到进程PID（最后一列数字）
echo 2. 运行：taskkill /F /PID [PID号]
echo.
pause
