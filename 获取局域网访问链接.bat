@echo off
chcp 65001 > nul
echo ========================================
echo    🌐 获取局域网访问链接
echo ========================================
echo.

echo 📡 正在获取本机 IP 地址...
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4"') do (
    set IP=%%a
    set IP=!IP: =!
    if not "!IP!"=="" (
        echo ✅ 局域网 IP：!IP!
        echo.
        echo 🔗 访问链接：http://!IP!:3002
        echo.
        echo 📋 请将此链接分享给同事
        echo    确保他们与您在同一局域网内
        echo.
    )
)

echo.
echo 💡 温馨提示：
echo    1. 确保开发服务器正在运行（npm run dev）
echo    2. 确保防火墙允许端口 3002
echo    3. 同事需要在同一局域网内
echo.

echo ========================================
echo.

pause
