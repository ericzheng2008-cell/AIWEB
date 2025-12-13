@echo off
chcp 65001 >nul
echo ========================================
echo   完整部署流程
echo   前端 + 后端一键部署
echo ========================================
echo.

cd /d "%~dp0"

echo [步骤1/4] 重新构建前端...
call npm run build
if errorlevel 1 (
    echo 构建失败！
    pause
    exit /b 1
)

echo.
echo [步骤2/4] 部署前端到 Vercel...
call vercel --prod --yes

echo.
echo [步骤3/4] 部署后端到 Railway...
cd server
call railway up

echo.
echo [步骤4/4] 获取后端域名...
call railway domain

echo.
echo ========================================
echo   部署完成！
echo ========================================
echo.
echo 前端地址: https://aiweb-gilt.vercel.app/
echo 后端地址: 请查看上方显示的 Railway 域名
echo.
echo ⚠️ 重要：如果后端域名发生变化，需要：
echo 1. 运行 update-api-url.bat 更新 API 地址
echo 2. 重新构建并部署前端
echo.
pause
