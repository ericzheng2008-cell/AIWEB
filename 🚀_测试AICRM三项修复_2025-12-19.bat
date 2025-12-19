@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   测试AICRM三项修复功能
echo ========================================
echo.
echo 📋 修复内容：
echo   ✅ 1. Globe图标错误修复
echo   ✅ 2. applySuggestion重复声明修复  
echo   ✅ 3. filteredAIPMProjects重复声明修复
echo.
echo 🚀 正在启动开发服务器...
echo.

cd /d "%~dp0"
start http://localhost:3002/#/aicrm
npm run dev

pause
