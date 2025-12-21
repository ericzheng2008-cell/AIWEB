@echo off
:: AIWEB 一键启动内网穿透 v1.0
:: 使用cpolar实现随时随地访问

chcp 65001 >nul
title AIWEB - 一键启动内网穿透

echo ========================================
echo  AIWEB 一键启动内网穿透
echo  让企业内测人员随时随地访问
echo ========================================
echo.

:: 检查cpolar是否已安装
where cpolar >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到cpolar，正在引导安装...
    echo.
    echo 请按以下步骤操作：
    echo 1. 访问 https://www.cpolar.com
    echo 2. 注册免费账号（或购买VIP获取固定域名）
    echo 3. 下载Windows客户端并安装
    echo 4. 运行 cpolar authtoken [你的token]
    echo.
    pause
    start https://www.cpolar.com/download
    exit /b 1
)

echo [1/5] 检查cpolar状态...
cpolar version
if %errorlevel% neq 0 (
    echo [错误] cpolar未正确安装
    pause
    exit /b 1
)
echo ✓ cpolar已安装
echo.

:: 检查Node.js
echo [2/5] 检查Node.js环境...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未找到Node.js，请先安装
    pause
    exit /b 1
)
echo ✓ Node.js已安装
echo.

:: 杀死已存在的进程
echo [3/5] 清理旧进程...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM cpolar.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo ✓ 清理完成
echo.

:: 启动后端
echo [4/5] 启动AIWEB后端服务...
cd /d "%~dp0server"
if not exist index.js (
    echo [错误] 未找到后端代码
    pause
    exit /b 1
)
start /min "AIWEB-Backend" cmd /c "node index.js"
timeout /t 5 /nobreak >nul
echo ✓ 后端服务已启动（端口5000）
echo.

:: 启动前端
echo [5/5] 启动AIWEB前端服务...
cd /d "%~dp0"
start /min "AIWEB-Frontend" cmd /c "npm run dev"
echo ✓ 前端服务已启动（端口3002）
echo.

:: 等待服务启动
echo [等待] 服务初始化中...
timeout /t 15 /nobreak >nul
echo.

:: 启动cpolar隧道
echo ========================================
echo 🚀 启动内网穿透隧道...
echo ========================================
echo.
echo 正在创建公网访问链接...
echo 请稍候 10-20 秒...
echo.

:: 启动cpolar（前台运行，显示访问地址）
cpolar http 3002

:: 如果cpolar退出
echo.
echo ========================================
echo ⚠️ 内网穿透已停止
echo ========================================
echo.

:: 询问是否重启
choice /C YN /M "是否重新启动？"
if errorlevel 2 goto :end
goto :start

:end
echo.
echo 正在关闭服务...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM cpolar.exe >nul 2>&1
echo.
echo 服务已关闭
pause
