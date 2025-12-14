@echo off
chcp 65001 >nul
cls
echo ========================================
echo   查看当前运行的服务器端口
echo ========================================
echo.

echo 正在查找 Node.js 进程占用的端口...
echo.

netstat -ano | findstr "node.exe" | findstr "LISTENING"

echo.
echo ========================================
echo 说明：
echo - 最后一列是进程ID（PID）
echo - 倒数第二列显示端口号（如 :3017）
echo.
echo 如果看到 :30XX 的端口，说明服务器正在该端口运行
echo 请在浏览器访问: http://localhost:端口号/
echo ========================================
echo.

pause
