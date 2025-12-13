@echo off
chcp 65001 >nul
echo ========================================
echo   紧急修复 - localhost:3000 打不开
echo ========================================
echo.

cd /d "%~dp0"

echo [步骤1/5] 检查并结束占用3000端口的进程...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do (
    echo 发现进程 %%a 占用3000端口，正在结束...
    taskkill /F /PID %%a 2>nul
)
echo ✓ 端口清理完成

echo.
echo [步骤2/5] 清理 Vite 缓存...
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
    echo ✓ Vite 缓存已清理
) else (
    echo ✓ 无需清理
)

echo.
echo [步骤3/5] 清理 dist 目录...
if exist dist (
    rmdir /s /q dist
    echo ✓ dist 已清理
) else (
    echo ✓ 无需清理
)

echo.
echo [步骤4/5] 验证依赖是否完整...
if not exist node_modules (
    echo ✗ node_modules 不存在，正在安装依赖...
    call npm install
) else (
    echo ✓ 依赖已存在
)

echo.
echo [步骤5/5] 启动开发服务器...
echo.
echo ========================================
echo   如果看到 "ready in xxx ms" 表示成功
echo   然后手动访问: http://localhost:3000
echo ========================================
echo.
timeout /t 2 /nobreak >nul

start http://localhost:3000
npm run dev

pause
