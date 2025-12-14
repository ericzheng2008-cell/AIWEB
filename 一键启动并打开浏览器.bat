@echo off
chcp 65001 >nul
cls

echo ========================================
echo   一键启动开发服务器并打开浏览器
echo ========================================
echo.

cd /d "%~dp0"

:: 1. 清理所有Node进程
echo [1/4] 清理旧进程...
taskkill /F /IM node.exe >nul 2>&1
if errorlevel 1 (
    echo    ✓ 无需清理
) else (
    echo    ✓ 旧进程已清理
)
timeout /t 2 /nobreak >nul

:: 2. 清理缓存
echo.
echo [2/4] 清理缓存...
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
    echo    ✓ Vite缓存已清理
) else (
    echo    ✓ 无缓存需清理
)

:: 3. 启动服务器（在新窗口）
echo.
echo [3/4] 启动开发服务器...
start "【Vite开发服务器 - 请勿关闭】" cmd /k "cd /d %~dp0 && echo ========================================== && echo    Vite 开发服务器 && echo ========================================== && echo. && echo 正在启动，请稍候... && echo. && npm run dev"

echo    ✓ 服务器正在启动...
echo.
echo    ⚠️  请注意：
echo    - 会弹出新的终端窗口
echo    - 请等待看到 "VITE ready" 信息
echo    - 不要关闭那个窗口

:: 4. 等待服务器启动
echo.
echo [4/4] 等待服务器就绪...
timeout /t 8 /nobreak

:: 5. 打开浏览器
echo.
echo ========================================
echo   正在打开浏览器...
echo ========================================

start http://localhost:3002

timeout /t 2 /nobreak >nul

echo.
echo ✅ 完成！
echo.
echo 📍 如果浏览器显示错误：
echo    1. 查看弹出的服务器窗口
echo    2. 找到 "Local: http://localhost:XXXX/"
echo    3. 使用那个端口号访问
echo.
echo 📍 如果还是无法访问：
echo    - 端口可能不是3002，请查看服务器窗口的实际端口
echo    - 手动在浏览器输入服务器窗口显示的地址
echo.

pause
