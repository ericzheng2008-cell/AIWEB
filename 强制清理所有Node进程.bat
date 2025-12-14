@echo off
chcp 65001 >nul
cls
echo ========================================
echo   强制清理所有 Node.js 进程
echo ========================================
echo.
echo ⚠️  警告：这将关闭所有正在运行的 Node.js 程序
echo ⚠️  如果有其他重要的 Node 应用在运行，请按 Ctrl+C 取消
echo.
pause

echo.
echo [1/3] 查找所有 Node 进程...
tasklist | findstr "node.exe"

echo.
echo [2/3] 强制终止所有 Node 进程...
taskkill /F /IM node.exe 2>nul

if errorlevel 1 (
    echo ℹ️  未发现运行中的 Node 进程
) else (
    echo ✅ 所有 Node 进程已终止
)

echo.
echo [3/3] 等待端口释放...
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   清理完成！
echo ========================================
echo.
echo 现在可以重新启动开发服务器：
echo 1. 双击运行 start-dev-server.bat
echo 2. 或运行命令: npm run dev
echo.

pause
