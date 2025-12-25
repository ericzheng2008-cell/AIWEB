@echo off
chcp 65001 >nul
title 📱 手机清除缓存 - 快速访问指南
color 0A

echo ====================================
echo    📱 手机端清除缓存快速通道
echo ====================================
echo.

:: 获取本机IP地址
echo [1] 正在获取您的局域网IP地址...
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4" ^| findstr /v "169.254"') do (
    set "IP=%%a"
    set "IP=!IP: =!"
    if defined IP (
        echo ✅ 局域网IP: !IP!
        echo.
        echo ====================================
        echo    🌐 手机端清除缓存地址
        echo ====================================
        echo.
        echo 请在手机浏览器中访问以下地址：
        echo.
        echo 📱 清除缓存工具:
        echo    http://!IP!:3000/clear-cache.html
        echo.
        echo 📱 主页地址:
        echo    http://!IP!:3000
        echo.
        echo 📱 后台管理:
        echo    http://!IP!:3000/admin
        echo.
        echo ====================================
        echo.
        goto :found
    )
)

:found
echo [2] 操作步骤：
echo.
echo    1️⃣  手机连接到与电脑相同的WiFi
echo    2️⃣  手机浏览器访问上面的清除缓存地址
echo    3️⃣  点击"清除缓存并刷新"按钮
echo    4️⃣  等待3秒自动刷新
echo    5️⃣  完成！查看更新后的内容
echo.
echo ====================================
echo.

echo [3] 如果清除缓存工具无法访问，手动清除：
echo.
echo    📱 iPhone Safari:
echo       设置 → Safari → 清除历史记录与网站数据
echo.
echo    📱 Android Chrome:
echo       Chrome → 菜单 → 设置 → 清除浏览数据
echo.
echo    📱 华为/小米浏览器:
echo       浏览器 → 设置 → 清除浏览数据
echo.
echo ====================================
echo.

pause
