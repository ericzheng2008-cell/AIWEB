@echo off
chcp 65001 >nul
title 测试VIP固定域名功能
color 0A

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║         🧪 测试VIP固定域名功能                           ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

:: 检查配置文件
echo [1/5] 🔍 检查VIP配置...
if not exist "%USERPROFILE%\.cpolar\cpolar.yml" (
    echo.
    echo ❌ 未检测到VIP配置文件！
    echo.
    echo 💡 请先运行VIP配置向导：
    echo    💎_VIP版本固定域名配置_2025-12-21.bat
    echo.
    pause
    exit /b 1
)
echo ✅ 配置文件存在
echo.

:: 检查cpolar版本
echo [2/5] 🔍 检查cpolar安装...
where cpolar >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ cpolar未安装！
    pause
    exit /b 1
)
echo ✅ cpolar已安装
echo.

:: 检查VIP状态
echo [3/5] 🔍 检查VIP账户状态...
echo.
echo 💡 请打开浏览器手动检查：
echo    https://dashboard.cpolar.com/vip
echo.
echo 确认：
echo   ✅ VIP状态：已激活
echo   ✅ 到期时间：有效期内
echo.
pause

:: 检查保留域名
echo [4/5] 🔍 检查保留域名...
echo.
echo 💡 请打开浏览器手动检查：
echo    https://dashboard.cpolar.com/reserved
echo.
echo 确认：
echo   ✅ 保留域名：已创建
echo   ✅ 地区：China VIP
echo   ✅ 类型：http
echo.
pause

:: 测试隧道
echo [5/5] 🧪 测试VIP固定隧道...
echo.
echo 正在启动测试...
echo.

:: 清理
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM cpolar.exe >nul 2>&1
timeout /t 2 >nul

:: 启动后端
echo 启动后端（端口5000）...
cd /d "%~dp0server"
start /min "测试-后端" cmd /k "node index.js"
timeout /t 5 >nul

:: 启动前端
echo 启动前端（端口5173）...
cd /d "%~dp0"
start /min "测试-前端" cmd /k "npm run dev"
timeout /t 15 >nul

:: 验证端口
netstat -ano | findstr ":5173.*LISTENING" >nul
if %errorlevel% neq 0 (
    echo ❌ 前端启动失败！
    pause
    exit /b 1
)

:: 启动cpolar
echo 启动VIP隧道...
start "测试-cpolar" cmd /k "echo 正在启动VIP隧道... && echo. && cpolar start-all"
timeout /t 10 >nul

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              📋 验证清单                                 ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   请按以下步骤验证VIP功能：
echo.
echo   1️⃣  打开cpolar管理界面
echo      http://localhost:9200
echo.
echo   2️⃣  检查隧道列表，确认：
echo      ✅ 隧道状态：Online
echo      ✅ 域名格式：https://您的子域名.cpolar.cn
echo      ✅ 域名固定：每次启动相同
echo.
echo   3️⃣  测试访问
echo      • 复制固定域名
echo      • 在浏览器打开
echo      • 确认能正常访问AIWEB
echo.
echo   4️⃣  重启测试（验证域名是否固定）
echo      • 关闭所有窗口
echo      • 重新运行本脚本
echo      • 检查域名是否与第一次相同
echo.
echo.
pause

:: 打开管理界面
echo 🌐 打开cpolar管理界面...
start http://localhost:9200

timeout /t 2 >nul

echo 📱 打开本地预览...
start http://localhost:5173

echo.
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              ✅ 测试环境已准备就绪                       ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   💡 下一步：
echo      1. 在cpolar管理界面查看固定域名
echo      2. 复制域名并在浏览器测试
echo      3. 记录域名以便后续验证
echo.
echo   🔄 重启测试：
echo      关闭所有窗口后重新运行本脚本
echo      验证域名是否保持不变
echo.
echo.
pause
