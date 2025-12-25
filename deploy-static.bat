@echo off
chcp 65001 >nul
echo ========================================
echo    静态文件部署到 Vercel
echo ========================================
echo.

echo [1/2] 本地构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 构建失败！
    pause
    exit /b 1
)
echo ✓ 构建成功

echo.
echo [2/2] 部署 dist 目录到 Vercel...
cd dist
vercel --prod
cd ..

echo.
echo ========================================
echo    部署完成！
echo ========================================
pause
