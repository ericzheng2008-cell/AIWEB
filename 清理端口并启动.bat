@echo off
chcp 65001 >nul
cls
echo ========================================
echo   清理端口占用并启动开发服务器
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 查找占用3002端口的进程...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002 ^| findstr LISTENING') do (
    echo 发现进程ID: %%a
    echo 正在终止进程...
    taskkill /F /PID %%a 2>nul
    if errorlevel 1 (
        echo 未找到占用进程或已释放
    ) else (
        echo ✓ 进程已终止
    )
)

echo.
echo [2/3] 等待端口释放...
timeout /t 2 /nobreak >nul
echo ✓ 端口已释放

echo.
echo [3/3] 启动开发服务器...
echo.
echo ========================================
echo   服务器即将启动
echo   预期URL: http://localhost:3002/
echo ========================================
echo.

npm run dev

pause
