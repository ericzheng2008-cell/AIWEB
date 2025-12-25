@echo off
chcp 65001 >nul
echo ========================================
echo    明升AIWEB 一键启动系统
echo ========================================
echo.

echo [1/3] 检查端口占用...
netstat -ano | findstr ":3000" >nul
if %errorlevel%==0 (
    echo ✓ 后端服务器已在运行 (端口3000)
) else (
    echo ○ 启动后端服务器...
    cd /d "%~dp0"
    start "AIWEB后端" cmd /k "cd server && node index.js"
    timeout /t 3 >nul
)

netstat -ano | findstr ":3002" >nul
if %errorlevel%==0 (
    echo ✓ 前端服务器已在运行 (端口3002)
) else (
    echo ○ 启动前端服务器...
    cd /d "%~dp0"
    start "AIWEB前端" cmd /k "npm run dev"
    timeout /t 5 >nul
)

echo.
echo [2/3] 等待服务器启动完成...
timeout /t 8 >nul

echo.
echo [3/3] 打开浏览器...
start http://localhost:3002

echo.
echo ========================================
echo    ✅ AIWEB 已成功启动！
echo.
echo    本地访问: http://localhost:3002
echo    后台管理: http://localhost:3002/admin
echo.
echo    提示: 请保持两个命令窗口运行
echo ========================================
echo.
pause
