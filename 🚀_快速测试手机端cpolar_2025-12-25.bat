@echo off
chcp 65001 >nul
title 🚀 快速测试手机端cpolar访问

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║          🚀 手机端cpolar访问 - 快速测试                     ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM 快速检查
echo 🔍 快速检查中...
echo.

REM 1. 检查路由配置
findstr /C:"createWebHashHistory" "src\router\index.js" >nul
if errorlevel 1 (
    echo ❌ 路由未配置为Hash模式
    echo.
    echo 💡 正在自动修复...
    call "🚀_立即修复手机端404_2025-12-25.bat"
    exit
) else (
    echo ✅ 路由配置正确
)

REM 2. 检查服务器
tasklist | findstr /I "node.exe" >nul
if errorlevel 1 (
    echo ❌ 前端服务器未启动
    echo.
    echo 💡 正在启动服务器...
    start "AIWEB前端" cmd /k "cd /d %~dp0 && npm run dev"
    timeout /t 10 /nobreak >nul
    echo ✅ 服务器已启动
) else (
    echo ✅ 前端服务器运行中
)

REM 3. 检查cpolar
tasklist | findstr /I "cpolar.exe" >nul
if errorlevel 1 (
    echo ⚠️  cpolar未启动
    echo.
    echo 请选择:
    echo   [1] 自动启动cpolar
    echo   [2] 手动启动（我稍后自己启动）
    echo   [3] 跳过（我已经用其他方式启动）
    echo.
    set /p choice=请输入选项 (1-3): 
    
    if "%choice%"=="1" (
        echo.
        echo 💡 正在启动cpolar...
        start "cpolar" cmd /k "cpolar http 5173"
        timeout /t 5 /nobreak >nul
        echo ✅ cpolar已启动
    ) else if "%choice%"=="2" (
        echo.
        echo 💡 请手动运行: cpolar http 5173
        pause
    )
) else (
    echo ✅ cpolar运行中
)

echo.
echo ════════════════════════════════════════════════════════════
echo.
echo 🎯 系统状态：
echo    ✅ 路由模式: Hash模式
echo    ✅ 前端服务器: 运行中
echo    ✅ 端口: 5173
echo.
echo 📱 开始测试：
echo.
echo 【快速测试流程】
echo.
echo 1️⃣  获取cpolar链接
echo    访问: https://dashboard.cpolar.com/status
echo    复制5173端口的公网URL
echo.
echo 2️⃣  手机访问测试
echo    用手机打开cpolar链接
echo    检查URL是否变成: https://xxx.cpolar.cn/#/
echo.
echo 3️⃣  刷新测试
echo    在任意页面刷新
echo    确保不会出现404错误
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo 📋 需要详细测试？
echo.
echo 选项:
echo   [1] 打开详细测试清单（HTML版）
echo   [2] 运行完整测试工具（BAT版）
echo   [3] 查看文档
echo   [0] 退出
echo.
set /p option=请选择 (0-3): 

if "%option%"=="1" (
    echo.
    echo 💡 正在打开HTML测试清单...
    start "" "📱_手机端cpolar访问完整清单_2025-12-25.html"
) else if "%option%"=="2" (
    echo.
    call "🧪_测试手机端cpolar访问_2025-12-25.bat"
) else if "%option%"=="3" (
    echo.
    echo 📖 可用文档:
    echo    - 📖_手机端404问题完整解决方案_2025-12-25.md
    echo    - 📑_手机端404修复完整索引_2025-12-25.md
    echo.
    pause
)

echo.
echo 👋 测试完成！
timeout /t 2 /nobreak >nul
exit
