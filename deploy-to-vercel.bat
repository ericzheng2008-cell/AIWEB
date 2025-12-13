@echo off
chcp 65001 >nul
echo ========================================
echo   部署到 Vercel - 获取公网访问链接
echo ========================================
echo.

cd /d "%~dp0"

echo [步骤1] 检查 Vercel CLI...
vercel --version >nul 2>&1
if errorlevel 1 (
    echo Vercel CLI 未安装，正在安装...
    npm install -g vercel
)

echo.
echo [步骤2] 登录 Vercel...
echo 浏览器将自动打开，请完成授权
vercel login

echo.
echo [步骤3] 部署项目...
echo.
vercel --prod --yes

echo.
echo ========================================
echo   部署完成！
echo   公网访问链接已显示在上方
echo   可以分享给任何人访问！
echo ========================================
pause
