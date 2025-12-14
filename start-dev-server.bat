@echo off
chcp 65001 >nul
cls
echo ========================================
echo   启动开发服务器
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 清理缓存...
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
)
if exist dist (
    rmdir /s /q dist
)
echo ✓ 缓存已清理

echo.
echo [2/3] 检查依赖...
if not exist node_modules\vite (
    echo 依赖不完整，正在安装...
    call npm install
    if errorlevel 1 (
        echo.
        echo ✗ 依赖安装失败！
        echo 建议运行: npm config set registry https://registry.npmmirror.com
        pause
        exit /b 1
    )
) else (
    echo ✓ 依赖完整
)

echo.
echo [3/3] 启动服务器...
echo.
echo ========================================
echo   预期输出:
echo   VITE v5.x.x  ready in xxx ms
echo   ➜  Local:   http://localhost:3002/
echo ========================================
echo.
echo 如果看到上述信息，请在浏览器打开:
echo http://localhost:3002
echo.
echo 如果报错，请截图完整错误信息
echo.
timeout /t 2 /nobreak >nul

npm run dev

echo.
echo ========================================
echo   服务器已停止
echo ========================================
pause
