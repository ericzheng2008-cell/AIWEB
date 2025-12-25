@echo off
chcp 65001 >nul 2>&1
title 测试后端启动
color 0B

echo ========================================
echo   🧪 后端服务器启动测试
echo ========================================
echo.

:: 检查 Node.js 版本
echo 【1/4】检查 Node.js 版本...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js 未安装！
    echo.
    echo 请先安装 Node.js (版本 ^>= 18.0.0)
    echo 下载地址: https://nodejs.org
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node --version') do set NODE_VERSION=%%v
echo ✅ Node.js 版本: %NODE_VERSION%
echo.

:: 检查 server 目录
echo 【2/4】检查项目结构...
if not exist "%~dp0server\index.js" (
    echo ❌ 找不到 server\index.js 文件！
    pause
    exit /b 1
)
echo ✅ 项目结构正常
echo.

:: 检查依赖安装
echo 【3/4】检查依赖安装...
cd /d "%~dp0server"
if not exist "node_modules" (
    echo ⚠️  依赖未安装
    echo.
    echo 是否现在安装依赖？(Y/N)
    set /p INSTALL=
    if /i "%INSTALL%"=="Y" (
        echo.
        echo 正在安装依赖...
        call npm install
        if errorlevel 1 (
            echo ❌ 依赖安装失败！
            pause
            exit /b 1
        )
        echo ✅ 依赖安装完成
    ) else (
        echo ⚠️  跳过依赖安装
    )
) else (
    echo ✅ 依赖已安装
)
echo.

:: 检查端口
echo 【4/4】检查端口3001...
netstat -ano | findstr :3001 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  端口3001已被占用
    echo.
    echo 占用进程信息：
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
        echo PID: %%a
        tasklist /FI "PID eq %%a" | findstr /v "Image Name"
    )
    echo.
    echo 是否终止占用进程？(Y/N)
    set /p KILL=
    if /i "%KILL%"=="Y" (
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
            taskkill /F /PID %%a >nul 2>&1
        )
        echo ✅ 进程已终止
    )
) else (
    echo ✅ 端口3001可用
)
echo.

echo ========================================
echo   ✅ 检查完成！
echo ========================================
echo.
echo 所有检查已完成，可以启动后端服务器了
echo.
echo 请运行以下脚本启动：
echo   • ⚡_启动后端服务器_2025-12-25.bat (标准启动)
echo   • ⭐_启动后端_诊断版_2025-12-25.bat (详细诊断)
echo.

pause
