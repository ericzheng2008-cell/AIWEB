@echo off
chcp 65001 >nul
color 0A
title 启动完整系统（前端+后端）

echo.
echo ========================================
echo   🚀 启动完整系统（前端+后端）
echo ========================================
echo.
echo 正在检查服务器状态...
echo.

cd /d "%~dp0"

rem 检查前端服务器 (5173端口)
netstat -ano | findstr ":5173" >nul
if %errorlevel%==0 (
    echo ✅ 前端服务器已在运行 (端口5173)
    set FRONTEND_RUNNING=1
) else (
    echo ❌ 前端服务器未运行
    set FRONTEND_RUNNING=0
)

rem 检查后端服务器 (3002端口)
netstat -ano | findstr ":3002" >nul
if %errorlevel%==0 (
    echo ✅ 后端服务器已在运行 (端口3002)
    set BACKEND_RUNNING=1
) else (
    echo ❌ 后端服务器未运行
    set BACKEND_RUNNING=0
)

echo.
echo ========================================
echo   启动服务
echo ========================================
echo.

rem 启动后端服务器
if %BACKEND_RUNNING%==0 (
    echo 📦 正在启动后端服务器 (端口3002)...
    start "后端服务器 - 端口3002" cmd /k "cd /d %~dp0 && npm run server"
    echo ✅ 后端服务器启动命令已执行
    timeout /t 3 >nul
) else (
    echo ℹ️  后端服务器已在运行，跳过启动
)

rem 启动前端服务器
if %FRONTEND_RUNNING%==0 (
    echo 🎨 正在启动前端服务器 (端口5173)...
    start "前端服务器 - 端口5173" cmd /k "cd /d %~dp0 && npm run dev"
    echo ✅ 前端服务器启动命令已执行
    timeout /t 5 >nul
) else (
    echo ℹ️  前端服务器已在运行，跳过启动
)

echo.
echo ========================================
echo   🎉 系统启动完成
echo ========================================
echo.
echo 📌 访问地址：
echo.
echo    前端界面：http://localhost:5173
echo    后端API： http://localhost:3002
echo.
echo ========================================
echo   服务说明
echo ========================================
echo.
echo 🎨 前端 (Vite) - 端口 5173
echo    - 用户界面
echo    - 实时热更新
echo    - 响应式设计
echo.
echo 📦 后端 (Express) - 端口 3002
echo    - API服务
echo    - 数据管理
echo    - 业务逻辑
echo.
echo ========================================
echo   温馨提示
echo ========================================
echo.
echo 1. 两个服务器窗口会分别打开
echo 2. 前端访问：http://localhost:5173
echo 3. 请勿关闭服务器窗口
echo 4. 按 Ctrl+C 可停止对应服务器
echo.
echo ⏳ 等待服务器完全启动（约10秒）...
timeout /t 10 >nul

echo.
echo 🌐 正在打开浏览器...
start http://localhost:5173

echo.
echo ✅ 系统已启动！
echo.
echo 如需停止服务，请关闭对应的命令行窗口
echo.
pause
