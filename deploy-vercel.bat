@echo off
chcp 65001 >nul
echo ========================================
echo   明升伟业网站 - Vercel 快速部署
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 检查 Vercel CLI...
vercel --version >nul 2>&1
if errorlevel 1 (
    echo Vercel CLI 未安装，正在安装...
    npm install -g vercel
)

echo.
echo [2/3] 登录 Vercel（浏览器将自动打开）...
echo 请在浏览器中完成登录授权
vercel login

echo.
echo [3/3] 开始部署项目...
echo.
vercel --prod

echo.
echo ========================================
echo   部署完成！
echo   请查看上方显示的访问地址
echo ========================================
pause
