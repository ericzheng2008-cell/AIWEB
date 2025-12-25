@echo off
chcp 65001 >nul
color 0A
echo ========================================
echo    🌐 AIWEB公网访问启动器
echo ========================================
echo.

:: 检查AIWEB是否运行
echo [1/3] 检查AIWEB服务器状态...
netstat -ano | findstr ":5173" >nul
if %errorlevel%==0 (
    echo ✅ AIWEB前端已运行 (端口5173)
) else (
    echo ❌ AIWEB前端未运行！
    echo.
    echo 请先运行: ⚡_一键启动AIWEB_2025-12-22.bat
    echo.
    pause
    exit
)

netstat -ano | findstr ":5000" >nul
if %errorlevel%==0 (
    echo ✅ AIWEB后端已运行 (端口5000)
) else (
    echo ⚠️  AIWEB后端未运行，某些功能可能无法使用
)

echo.
echo [2/3] 启动cpolar内网穿透...
echo.
echo ⏳ 正在创建公网隧道，请稍候...
echo.

:: 启动cpolar
cpolar http 5173

echo.
echo [3/3] 已启动！
echo.
echo ========================================
echo    📱 如何使用公网链接
echo ========================================
echo.
echo 在上方输出中找到这样的一行：
echo   Forwarding    https://xxxx.vip.cpolar.cn
echo.
echo 将该链接分享给其他人即可异地访问！
echo.
echo ⚠️  注意：
echo    - 免费版每次重启URL会变化
echo    - 如需固定域名，请升级cpolar VIP
echo    - 保持此窗口运行，关闭即断开
echo.
echo ========================================
pause
