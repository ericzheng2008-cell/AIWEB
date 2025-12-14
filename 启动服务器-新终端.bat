@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo   启动开发服务器
echo ========================================
echo.
echo 正在启动 Vite 开发服务器...
echo.

start "Vite开发服务器" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ✅ 服务器已在新窗口启动
echo.
echo 请等待几秒后访问:
echo http://localhost:3002/
echo.

pause
