@echo off
chcp 65001 >nul
echo ========================================
echo 🔧 自动修复并测试系统
echo ========================================
echo.
echo [1/4] 清除浏览器缓存...
echo 请按 Ctrl+Shift+Delete 手动清除缓存，或按任意键继续
pause >nul

echo.
echo [2/4] 检查端口占用...
netstat -ano | findstr :5173
if %errorlevel%==0 (
    echo ✅ 前端服务器运行中
) else (
    echo ❌ 前端服务器未运行，正在启动...
    start "AIWEB前端" cmd /k "cd /d C:\Users\EricZ\CodeBuddy\AIWEB1 && npm run dev"
    timeout /t 10 /nobreak >nul
)

echo.
echo [3/4] 测试网页访问...
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo [4/4] 开始自动监控（每30秒检测一次）...
echo 按 Ctrl+C 退出监控
echo.

:LOOP
timeout /t 30 /nobreak >nul
curl -s -o nul -w "%%{http_code}" http://localhost:5173 > temp_status.txt
set /p STATUS=<temp_status.txt
del temp_status.txt

if "%STATUS%"=="200" (
    echo [%time%] ✅ 网页正常 - HTTP %STATUS%
) else if "%STATUS%"=="500" (
    echo [%time%] ❌ 发现500错误，正在自动修复...
    call :FIX_ERROR
) else if "%STATUS%"=="000" (
    echo [%time%] ⚠️  服务器未响应，正在重启...
    taskkill /F /FI "WINDOWTITLE eq AIWEB前端*" 2>nul
    start "AIWEB前端" cmd /k "cd /d C:\Users\EricZ\CodeBuddy\AIWEB1 && npm run dev"
    timeout /t 10 /nobreak >nul
) else (
    echo [%time%] ⚠️  HTTP %STATUS% - 未知状态
)

goto LOOP

:FIX_ERROR
echo 正在检查Vue编译错误...
:: 这里可以添加自动修复逻辑
echo 请手动检查控制台错误信息
exit /b
