@echo off
chcp 65001 >nul
cls
echo ========================================
echo   本地启动测试（最可靠）
echo ========================================
echo.

cd /d "%~dp0"

echo [方案] 既然在线部署有问题，我们先本地测试
echo.

echo [步骤1] 清理缓存...
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
)

echo.
echo [步骤2] 启动本地服务器...
echo 浏览器将自动打开 http://localhost:3000
echo.
echo 如果本地能正常运行，说明代码没问题
echo 然后我们再解决部署问题
echo.
timeout /t 2 /nobreak >nul

start http://localhost:3000
npm run dev

pause
