@echo off
chcp 65001 >nul
echo ========================================
echo    AIWEB 端口诊断和启动工具
echo ========================================
echo.

echo [诊断] 检查当前端口占用情况...
echo.
echo 检查 5173 端口:
netstat -ano | findstr ":5173"
if %errorlevel%==0 (
    echo ✓ 5173 端口已被占用
) else (
    echo ○ 5173 端口空闲
)

echo.
echo 检查 3002 端口 (项目配置端口):
netstat -ano | findstr ":3002"
if %errorlevel%==0 (
    echo ✓ 3002 端口已被占用 (前端服务器可能在运行)
) else (
    echo ○ 3002 端口空闲
)

echo.
echo 检查 3000 端口 (后端服务器):
netstat -ano | findstr ":3000"
if %errorlevel%==0 (
    echo ✓ 3000 端口已被占用 (后端服务器可能在运行)
) else (
    echo ○ 3000 端口空闲
)

echo.
echo 检查 5000 端口 (API服务器):
netstat -ano | findstr ":5000"
if %errorlevel%==0 (
    echo ✓ 5000 端口已被占用
) else (
    echo ○ 5000 端口空闲
)

echo.
echo ========================================
echo    诊断结果说明
echo ========================================
echo.
echo 【重要】本项目使用的端口:
echo   - 前端: http://localhost:3002
echo   - 后端: http://localhost:3000 或 5000
echo.
echo 如果你想访问 5173 端口,需要:
echo   1. 修改 vite.config.js 中的端口配置
echo   2. 或者使用正确的 3002 端口访问
echo.
echo ========================================
echo.

echo [选择] 请选择操作:
echo   1. 使用 3002 端口启动 (推荐)
echo   2. 修改为 5173 端口并启动
echo   3. 仅查看诊断信息
echo.
set /p choice="请输入选项 (1/2/3): "

if "%choice%"=="1" (
    echo.
    echo [启动] 使用 3002 端口启动服务器...
    cd /d "%~dp0"
    
    REM 检查后端
    netstat -ano | findstr ":3000" >nul
    if %errorlevel% neq 0 (
        echo 启动后端服务器...
        start "AIWEB后端" cmd /k "cd server && node index.js"
        timeout /t 3 >nul
    )
    
    REM 检查前端
    netstat -ano | findstr ":3002" >nul
    if %errorlevel% neq 0 (
        echo 启动前端服务器...
        start "AIWEB前端" cmd /k "npm run dev"
        timeout /t 5 >nul
    )
    
    echo.
    echo 等待服务器启动...
    timeout /t 5 >nul
    
    echo.
    echo ✅ 正在打开浏览器 http://localhost:3002
    start http://localhost:3002
    
) else if "%choice%"=="2" (
    echo.
    echo [修改] 正在修改为 5173 端口...
    echo 注意: 需要手动修改 vite.config.js 文件
    echo 将 port: 5173 改为实际需要的端口
    pause
    
) else (
    echo.
    echo 仅显示诊断信息,不进行启动操作
)

echo.
echo ========================================
pause
