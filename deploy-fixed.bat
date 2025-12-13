@echo off
chcp 65001 >nul
echo ========================================
echo   明升伟业网站 - 重新部署（已修复）
echo ========================================
echo.

cd /d "%~dp0"

echo [步骤1] 重新构建项目...
call npm run build
if errorlevel 1 (
    echo 构建失败！
    pause
    exit /b 1
)

echo.
echo [步骤2] 提交更新到 Git...
git add .
git commit -m "Update: 修复 Vercel 配置"

echo.
echo [步骤3] 开始部署到 Vercel...
echo.
vercel --prod --yes

echo.
echo ========================================
echo   部署完成！
echo   请查看上方显示的访问地址
echo ========================================
pause
