@echo off
chcp 65001 >nul
echo ========================================
echo    Vercel 部署脚本
echo ========================================
echo.

echo [1/3] 检查 Vercel CLI...
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI 未安装！
    echo 💡 提示: 运行 npm i -g vercel 安装
    pause
    exit /b 1
)
echo ✓ Vercel CLI 已安装

echo.
echo [2/3] 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 构建失败！
    pause
    exit /b 1
)
echo ✓ 构建成功

echo.
echo [3/3] 部署到 Vercel...
echo.
vercel --prod

echo.
echo ========================================
echo    部署完成！
echo ========================================
pause
