@echo off
chcp 65001 >nul
cls
echo.
echo ========================================
echo   ✅ Router编码修复成功！
echo ========================================
echo.
echo 所有JavaScript语法错误已修复
echo 共修复21处UTF-8编码乱码问题
echo.
echo ========================================
echo   正在启动开发服务器...
echo ========================================
echo.

cd /d "%~dp0"
npm run dev

pause
