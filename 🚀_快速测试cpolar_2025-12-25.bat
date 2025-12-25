@echo off
chcp 65001 >nul
title cpolar 快速测试 - 手机端404修复
color 0B

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║           🚀 cpolar 快速测试 - 手机端访问               ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

:: 步骤1: 检查authtoken
echo [1/4] 检查 authtoken 配置...
if exist "%USERPROFILE%\.cpolar\cpolar.yml" (
    echo ✅ authtoken 配置文件已存在
) else (
    echo ❌ authtoken 未配置
    echo 💡 请运行: cpolar authtoken YOUR_TOKEN
    pause
    exit /b 1
)

:: 步骤2: 检查服务
echo.
echo [2/4] 检查本地服务状态...
netstat -ano | findstr ":5173.*LISTENING" >nul
if %errorlevel% neq 0 (
    echo ❌ 前端服务（5173）未运行
    echo 💡 请先运行: 🚀_一键启动AIWEB_2025-12-22.bat
    pause
    exit /b 1
)
echo ✅ 前端服务运行正常

:: 步骤3: 启动cpolar
echo.
echo [3/4] 启动 cpolar 内网穿透...
taskkill /F /IM cpolar.exe >nul 2>&1
timeout /t 2 >nul

start "cpolar" cmd /k "title cpolar内网穿透 && color 0E && echo. && echo 🌐 cpolar 公网地址： && echo ══════════════════════════════════════ && cpolar http 5173"

timeout /t 8 >nul

:: 步骤4: 打开管理界面
echo.
echo [4/4] 打开 cpolar 管理界面...
start http://localhost:9200

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║                    ✅ 启动完成！                         ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo 📋 下一步操作：
echo.
echo 1️⃣  在弹出的 cpolar 窗口中复制 https://xxx.cpolar.cn 地址
echo 2️⃣  在手机浏览器中打开该地址
echo 3️⃣  测试访问各个页面
echo.
echo 💡 如果遇到404错误：
echo    → 双击运行: 🚀_立即修复手机端404_2025-12-25.bat
echo.
echo ⚠️  注意：不要关闭 cpolar 窗口！
echo.
pause
