@echo off
chcp 65001 > nul
echo ========================================
echo    🚀 启动本地预览服务器
echo ========================================
echo.

echo 📦 检查构建文件...
if not exist "dist" (
    echo ❌ dist 文件夹不存在
    echo 📦 正在构建项目...
    call npm run build
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ 构建失败！
        pause
        exit /b 1
    )
)

echo ✅ 构建文件已就绪
echo.

echo 🌐 正在获取本机 IP...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4" ^| findstr /V "127.0.0.1"') do (
    set IP=%%a
    set IP=!IP: =!
    goto :found_ip
)

:found_ip
echo.
echo ========================================
echo    ✅ 服务器启动成功！
echo ========================================
echo.
echo 🔗 本地访问：http://localhost:4173
echo 🔗 局域网访问：http://%IP%:4173
echo.
echo 📋 分享给同事（局域网）：
echo    http://%IP%:4173
echo.
echo 💡 按 Ctrl+C 停止服务器
echo ========================================
echo.

npm run preview -- --host 0.0.0.0 --port 4173
