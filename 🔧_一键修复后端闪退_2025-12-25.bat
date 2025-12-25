@echo off
chcp 65001 >nul 2>&1
title 一键修复后端闪退问题
color 0E

echo ========================================
echo   🔧 后端闪退问题一键修复
echo ========================================
echo.
echo 本脚本将自动执行以下操作：
echo   1. 释放端口3001
echo   2. 检查并安装依赖
echo   3. 创建必要的目录
echo   4. 验证环境配置
echo   5. 启动后端服务器
echo.
echo 按任意键开始修复...
pause >nul
echo.

:: 步骤1: 释放端口
echo 【1/5】释放端口3001...
netstat -ano | findstr :3001 >nul 2>&1
if %errorlevel% equ 0 (
    echo   正在终止占用进程...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 2 >nul
    echo   ✅ 端口已释放
) else (
    echo   ✅ 端口未被占用
)
echo.

:: 步骤2: 进入server目录
cd /d "%~dp0server"

:: 步骤3: 检查并安装依赖
echo 【2/5】检查依赖...
if not exist "node_modules" (
    echo   ⚠️  依赖未安装，正在安装...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo   ❌ 依赖安装失败！
        echo.
        echo   请检查：
        echo     1. 网络连接是否正常
        echo     2. npm 是否正确安装
        echo.
        pause
        exit /b 1
    )
    echo   ✅ 依赖安装完成
) else (
    echo   ✅ 依赖已安装
)
echo.

:: 步骤4: 创建必要目录
echo 【3/5】创建必要目录...
cd /d "%~dp0"
if not exist "data" (
    mkdir "data" 2>nul
    echo   ✅ 已创建 data 目录
)
if not exist "public\uploads" (
    mkdir "public\uploads" 2>nul
    echo   ✅ 已创建 public\uploads 目录
)
echo   ✅ 目录检查完成
echo.

:: 步骤5: 验证配置
echo 【4/5】验证配置...
if not exist "server\index.js" (
    echo   ❌ 找不到 server\index.js
    pause
    exit /b 1
)
echo   ✅ 配置文件正常
echo.

:: 步骤6: 启动服务器
echo 【5/5】启动后端服务器...
echo.
echo ========================================
echo   🚀 后端服务器启动中...
echo   端口: 3001
echo ========================================
echo.

cd /d "%~dp0server"
node index.js

:: 如果启动失败
if errorlevel 1 (
    echo.
    echo ========================================
    echo   ❌ 启动失败！
    echo ========================================
    echo.
    echo 可能的原因：
    echo   1. Node.js 版本过低 (需要 ^>= 18.0.0)
    echo   2. 代码存在语法错误
    echo   3. 系统权限不足
    echo.
    echo 建议操作：
    echo   1. 检查 Node.js 版本: node --version
    echo   2. 以管理员身份运行此脚本
    echo   3. 查看上方详细错误信息
    echo.
    echo 或运行诊断脚本获取更多信息：
    echo   ⭐_启动后端_诊断版_2025-12-25.bat
    echo.
)

pause
