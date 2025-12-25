@echo off
chcp 65001 >nul 2>&1
title 后端服务器诊断启动 - 端口3001
color 0A

echo ========================================
echo   🔍 后端服务器诊断启动
echo ========================================
echo.

:: 进入server目录
cd /d "%~dp0server"

echo 📍 当前目录: %CD%
echo.

:: 检查node_modules是否存在
echo 【1/5】检查依赖安装...
if not exist "node_modules" (
    echo ❌ 依赖未安装，正在安装...
    call npm install
    if errorlevel 1 (
        echo.
        echo ❌ 依赖安装失败！
        echo.
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
) else (
    echo ✅ 依赖已安装
)
echo.

:: 检查关键文件
echo 【2/5】检查关键文件...
if not exist "index.js" (
    echo ❌ 找不到 index.js 文件！
    pause
    exit /b 1
)
echo ✅ index.js 存在
echo.

:: 检查端口占用
echo 【3/5】检查端口3001占用情况...
netstat -ano | findstr :3001 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  端口3001已被占用！
    echo.
    echo 正在尝试释放端口...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 2 >nul
    echo ✅ 端口已释放
) else (
    echo ✅ 端口3001可用
)
echo.

:: 检查数据目录
echo 【4/5】检查数据目录...
if not exist "..\data" (
    echo ⚠️  数据目录不存在，正在创建...
    mkdir "..\data" 2>nul
)
if not exist "..\public\uploads" (
    echo ⚠️  上传目录不存在，正在创建...
    mkdir "..\public\uploads" 2>nul
)
echo ✅ 目录检查完成
echo.

:: 启动服务器
echo 【5/5】启动后端服务器...
echo.
echo ========================================
echo   🚀 服务器启动中...
echo   端口: 3001
echo   按 Ctrl+C 停止服务器
echo ========================================
echo.

node index.js

:: 如果服务器异常退出
if errorlevel 1 (
    echo.
    echo ========================================
    echo   ❌ 服务器启动失败！
    echo ========================================
    echo.
    echo 可能的原因：
    echo   1. Node.js 版本过低（需要 ^>= 18.0.0）
    echo   2. 依赖包损坏
    echo   3. 代码语法错误
    echo.
    echo 建议操作：
    echo   1. 检查 Node.js 版本: node --version
    echo   2. 重新安装依赖: npm install
    echo   3. 查看上方错误信息
    echo.
)

pause
