@echo off
chcp 65001 >nul
title cpolar VIP - 快速启动
color 0D

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║         💎 cpolar VIP版本 - 快速启动                    ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

:: 检查配置文件
if not exist "%USERPROFILE%\.cpolar\cpolar.yml" (
    echo.
    echo ❌ 未检测到VIP配置文件！
    echo.
    echo 💡 请先运行配置向导：
    echo    💎_VIP版本固定域名配置_2025-12-21.bat
    echo.
    pause
    exit /b 1
)

:: 清理旧进程
echo [1/4] 🧹 清理旧进程...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM cpolar.exe >nul 2>&1
timeout /t 3 >nul
echo ✅ 清理完成
echo.

:: 启动后端
echo [2/4] 🔧 启动后端服务（端口5000）...
cd /d "%~dp0server"
start /min "AIWEB-后端" cmd /k "title AIWEB后端服务(5000)-VIP && color 0B && echo [后端VIP] 正在启动... && node index.js"
timeout /t 5 >nul
echo ✅ 后端已启动
echo.

:: 启动前端
echo [3/4] 🎨 启动前端服务（端口5173）...
cd /d "%~dp0"
start /min "AIWEB-前端" cmd /k "title AIWEB前端服务(5173)-VIP && color 0A && echo [前端VIP] 正在启动... && npm run dev"
timeout /t 15 >nul

:: 验证前端
netstat -ano | findstr ":5173.*LISTENING" >nul
if %errorlevel% neq 0 (
    echo ❌ 前端启动失败！
    pause
    exit /b 1
)
echo ✅ 前端已启动
echo.

:: 启动cpolar VIP隧道
echo [4/4] 💎 启动VIP固定隧道...
start "cpolar-VIP" cmd /k "title cpolar VIP固定隧道 && color 0D && echo. && echo ═════════════════════════════════════ && echo    💎 cpolar VIP 固定隧道 && echo ═════════════════════════════════════ && echo. && echo ✅ VIP服务启动中... && echo. && echo 💡 您的固定地址将在下方显示 && echo. && echo ⚠️  请不要关闭此窗口！ && echo. && cpolar start-all"
timeout /t 8 >nul
echo ✅ VIP隧道已启动
echo.

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              ✅ VIP服务启动完成！                        ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   📊 查看固定地址：
echo      • Web控制台：http://localhost:9200
echo      • cpolar窗口：查看"cpolar-VIP"窗口
echo      • 在线控制台：https://dashboard.cpolar.com/status
echo.
echo   💡 VIP优势：
echo      ✅ 域名永久固定
echo      ✅ 7×24小时运行
echo      ✅ 高速VIP节点
echo.

:: 打开管理界面
timeout /t 2 >nul
echo 🌐 打开cpolar管理界面...
start http://localhost:9200

timeout /t 1 >nul
echo 📱 打开本地预览...
start http://localhost:5173

echo.
echo.
pause
