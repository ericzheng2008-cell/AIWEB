@echo off
chcp 65001 >nul
title AIWEB 手机访问启动器 v1.0

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║                                                      ║
echo ║        📱 AIWEB 手机访问启动器 v1.0                ║
echo ║                                                      ║
echo ╚══════════════════════════════════════════════════════╝
echo.

:: 检测端口占用
echo [1/5] 🔍 检测端口占用...
netstat -ano | findstr :3002 >nul
if %errorlevel% equ 0 (
    echo ⚠️  端口3002已被占用，正在清理...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 2 >nul
)

netstat -ano | findstr :5000 >nul
if %errorlevel% equ 0 (
    echo ⚠️  端口5000已被占用，正在清理...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 2 >nul
)

echo ✅ 端口检测完成
echo.

:: 获取本机IP
echo [2/5] 🌐 获取本机IP地址...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4" ^| findstr /V "127.0.0.1"') do (
    set IP=%%a
    goto :ip_found
)
:ip_found
:: 去除空格
set IP=%IP: =%

if "%IP%"=="" (
    echo ❌ 无法获取IP地址，请检查网络连接
    pause
    exit /b 1
)

echo ✅ 本机IP: %IP%
echo.

:: 启动后端
echo [3/5] 🚀 启动后端服务器...
start "AIWEB-后端服务器" cmd /k "cd /d %~dp0server && echo [后端服务器] 正在启动... && node index.js"
timeout /t 5 >nul
echo ✅ 后端已启动（端口5000）
echo.

:: 启动前端
echo [4/5] 🎨 启动前端服务器...
start "AIWEB-前端服务器" cmd /k "cd /d %~dp0 && echo [前端服务器] 正在启动... && npm run dev"
timeout /t 10 >nul
echo ✅ 前端已启动（端口3002）
echo.

:: 生成访问信息
echo [5/5] 📝 生成访问信息...
echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║                                                      ║
echo ║              📱 手机访问地址                        ║
echo ║                                                      ║
echo ╚══════════════════════════════════════════════════════╝
echo.
echo   🌐 主访问地址：http://%IP%:3002
echo   🔌 API地址：   http://%IP%:5000
echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║                                                      ║
echo ║              💡 操作指南                            ║
echo ║                                                      ║
echo ╚══════════════════════════════════════════════════════╝
echo.
echo   1️⃣  确保手机与电脑连接同一WiFi
echo   2️⃣  在手机浏览器输入上述地址
echo   3️⃣  推荐使用Chrome或Safari浏览器
echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║                                                      ║
echo ║              📌 添加到手机桌面                      ║
echo ║                                                      ║
echo ╚══════════════════════════════════════════════════════╝
echo.
echo   📱 iOS系统：
echo      Safari打开后，点击「分享」→「添加到主屏幕」
echo.
echo   🤖 Android系统：
echo      Chrome打开后，点击「⋮」→「添加到主屏幕」
echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║                                                      ║
echo ║              🔧 管理命令                            ║
echo ║                                                      ║
echo ╚══════════════════════════════════════════════════════╝
echo.
echo   📊 查看日志：切换到对应的命令行窗口
echo   🛑 停止服务：关闭两个命令行窗口
echo   🔄 重启服务：关闭后重新运行本脚本
echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║                                                      ║
echo ║              ⚠️  防火墙提示                         ║
echo ║                                                      ║
echo ╚══════════════════════════════════════════════════════╝
echo.
echo   如果手机无法访问，请执行以下命令（管理员权限）：
echo.
echo   netsh advfirewall firewall add rule name="AIWEB 3002" dir=in action=allow protocol=TCP localport=3002
echo   netsh advfirewall firewall add rule name="AIWEB 5000" dir=in action=allow protocol=TCP localport=5000
echo.

:: 自动打开浏览器
echo 正在打开浏览器预览...
timeout /t 3 >nul
start http://localhost:3002

echo.
echo ═══════════════════════════════════════════════════════
echo   ✅ 部署完成！
echo   请在手机浏览器访问：http://%IP%:3002
echo ═══════════════════════════════════════════════════════
echo.
pause
