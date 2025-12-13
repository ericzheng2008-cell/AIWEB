@echo off
chcp 65001 >nul
cls
echo ========================================
echo   正在部署到 Vercel
echo ========================================
echo.

cd /d "%~dp0"

echo [步骤 1/3] 清理旧的构建...
if exist dist (
    rmdir /s /q dist
    echo ✓ 已清理
)

echo.
echo [步骤 2/3] 构建项目...
echo 这可能需要 1-2 分钟，请稍候...
echo.
call npm run build

if errorlevel 1 (
    echo.
    echo ✗ 构建失败！
    echo 请检查错误信息
    pause
    exit /b 1
)

echo.
echo ✓ 构建完成！
echo.

echo [步骤 3/3] 部署到 Vercel...
echo.
vercel --prod --yes

if errorlevel 1 (
    echo.
    echo ✗ 部署失败！
    echo.
    echo 可能原因：
    echo 1. Vercel CLI 未登录
    echo 2. 网络连接问题
    echo.
    echo 解决方案：
    echo 先运行：vercel login
    pause
    exit /b 1
)

echo.
echo ========================================
echo   🎉 部署成功！
echo ========================================
echo.
echo 您的网站地址：
echo https://aiweb-gilt.vercel.app/
echo.
echo 现在可以：
echo 1. 在浏览器中访问上述网址
echo 2. 分享链接给任何人
echo 3. 如果需要后端功能，运行 deploy-backend.bat
echo.
pause
