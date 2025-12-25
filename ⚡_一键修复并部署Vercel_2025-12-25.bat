@echo off
chcp 65001 >nul
title ⚡ Vercel闪退修复 - 一键部署

echo.
echo ========================================
echo    ⚡ Vercel闪退问题 - 一键修复部署
echo ========================================
echo.
echo 🔧 修复内容:
echo    ✅ Router切换为History模式
echo    ✅ 路径编码问题修复
echo    ✅ Vercel配置优化
echo.

echo 📦 正在构建项目...
call npm run build
if errorlevel 1 (
    echo.
    echo ❌ 构建失败！请检查错误信息
    pause
    exit /b 1
)

echo.
echo ✅ 构建成功！
echo.
echo 🚀 准备部署到Vercel...
echo.
echo 请选择部署方式:
echo    1. 使用Vercel CLI部署（推荐）
echo    2. 使用Git推送自动部署
echo    3. 取消部署
echo.
set /p choice=请输入选项 (1/2/3): 

if "%choice%"=="1" (
    echo.
    echo 🚀 使用Vercel CLI部署...
    call vercel --prod
    if errorlevel 1 (
        echo.
        echo ⚠️  Vercel CLI未安装或部署失败
        echo 💡 提示: 运行 npm i -g vercel 安装Vercel CLI
        pause
        exit /b 1
    )
) else if "%choice%"=="2" (
    echo.
    echo 📤 推送到GitHub...
    git add .
    git commit -m "🔧 修复Vercel闪退问题 - Router+路径编码优化"
    git push
    echo.
    echo ✅ 已推送到GitHub，Vercel将自动部署
    echo 💡 请访问 https://vercel.com 查看部署状态
) else (
    echo.
    echo ❌ 已取消部署
    pause
    exit /b 0
)

echo.
echo ========================================
echo    🎉 部署完成！
echo ========================================
echo.
echo 📋 修复详情:
echo    • Hash模式 → History模式
echo    • path.resolve → fileURLToPath
echo    • Vercel路由配置优化
echo    • 缓存策略优化
echo.
echo 💡 测试要点:
echo    1. 刷新页面不闪退
echo    2. 路由跳转正常
echo    3. 中文路径正确编码
echo.
pause
