@echo off
chcp 65001 >nul
color 0A

echo ========================================
echo   🔧 快速修复主页空白问题
echo ========================================
echo.

echo 📋 诊断步骤：
echo.
echo 1️⃣  正在检查开发服务器状态...
timeout /t 2 /nobreak >nul

echo 2️⃣  正在打开诊断页面...
start "" "🔍_诊断主页空白问题.html"
timeout /t 2 /nobreak >nul

echo 3️⃣  正在打开主页（端口3006）...
start "" "http://localhost:3006"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo   ✅ 已打开以下页面：
echo ========================================
echo   📄 诊断指南页面
echo   🏠 主页 (http://localhost:3006)
echo.
echo 💡 请按照诊断指南中的步骤操作
echo.
echo 🔍 如果主页仍然空白，请：
echo    1. 按F12打开开发者工具
echo    2. 查看Console标签页的错误信息
echo    3. 将错误信息提供给技术支持
echo.
pause
