@echo off
chcp 65001 >nul
echo ========================================
echo   明升伟业网站 - Netlify 部署
echo ========================================
echo.

cd /d "%~dp0"

echo [步骤1/3] 检查构建文件...
if not exist "dist\index.html" (
    echo 正在构建项目...
    call npm run build
    if errorlevel 1 (
        echo 构建失败！
        pause
        exit /b 1
    )
)

echo.
echo [步骤2/3] 登录 Netlify...
echo 浏览器将自动打开，请完成授权
netlify login

echo.
echo [步骤3/3] 部署到 Netlify...
echo.
netlify deploy --prod --dir=dist

echo.
echo ========================================
echo   部署完成！
echo   访问地址已显示在上方
echo ========================================
pause
