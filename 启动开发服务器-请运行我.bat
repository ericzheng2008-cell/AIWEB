@echo off
chcp 65001 >nul
cls

echo ========================================
echo   启动开发服务器
echo ========================================
echo.

:: 切换到项目目录
cd /d "%~dp0"

:: 显示当前目录
echo 当前目录: %CD%
echo.

:: 检查package.json是否存在
if not exist package.json (
    echo ❌ 错误: 找不到 package.json
    echo    请确保在项目根目录运行此脚本
    pause
    exit /b 1
)

:: 检查node_modules是否存在
if not exist node_modules (
    echo ⚠️  依赖未安装，正在安装...
    call npm install
    if errorlevel 1 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
)

echo ========================================
echo   启动中...
echo ========================================
echo.
echo 🚀 服务器启动后将显示访问地址
echo.
echo 📍 请等待看到以下信息:
echo    ➜  Local:   http://localhost:XXXX/
echo.
echo 然后在浏览器中打开该地址
echo.
echo ⚠️  不要关闭此窗口，否则服务器会停止
echo ========================================
echo.

:: 启动开发服务器
npm run dev

:: 如果服务器停止，显示信息
echo.
echo ========================================
echo   服务器已停止
echo ========================================
pause
