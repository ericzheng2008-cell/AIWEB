@echo off
chcp 65001 >nul
title AIWEB - Vercel一键部署
color 0A

echo.
echo    ╔════════════════════════════════════════╗
echo    ║   AIWEB网站 - Vercel一键部署工具     ║
echo    ╚════════════════════════════════════════╝
echo.

cd /d "%~dp0"

:: 步骤1：环境检查
echo [步骤 1/6] 环境检查中...
vercel --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ⚠️  Vercel CLI未安装，正在自动安装...
    call npm install -g vercel
    if errorlevel 1 (
        color 0C
        echo.
        echo ❌ 安装失败！请手动运行：npm install -g vercel
        pause
        exit /b 1
    )
)
echo ✅ 环境检查完成

:: 步骤2：清理旧文件
echo.
echo [步骤 2/6] 清理旧构建...
if exist dist rmdir /s /q dist >nul 2>&1
if exist node_modules\.vite rmdir /s /q node_modules\.vite >nul 2>&1
echo ✅ 清理完成

:: 步骤3：安装依赖
echo.
echo [步骤 3/6] 检查项目依赖...
if not exist node_modules (
    echo ⚠️  依赖未安装，正在安装...
    call npm install
    if errorlevel 1 (
        color 0C
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
) else (
    echo ✅ 依赖已就绪
)

:: 步骤4：本地构建测试
echo.
echo [步骤 4/6] 本地构建测试...
echo 正在构建项目（需要1-3分钟）...
call npm run build
if errorlevel 1 (
    color 0C
    echo.
    echo ╔════════════════════════════════════════╗
    echo ║          ❌ 构建失败！                ║
    echo ╚════════════════════════════════════════╝
    echo.
    echo 请尝试以下解决方案：
    echo.
    echo 1️⃣  运行诊断工具：
    echo    🔧_Vercel部署诊断_2025-12-25.bat
    echo.
    echo 2️⃣  查看详细指南：
    echo    📖_Vercel部署完整指南_2025-12-25.md
    echo.
    echo 3️⃣  增加内存后重试：
    echo    set NODE_OPTIONS=--max_old_space_size=4096
    echo    npm run build
    echo.
    pause
    exit /b 1
)
echo ✅ 构建成功

:: 步骤5：登录Vercel
echo.
echo [步骤 5/6] Vercel账户登录...
echo.
echo 💡 提示：浏览器会自动打开，请在浏览器中完成登录
echo.
vercel login
if errorlevel 1 (
    color 0C
    echo ❌ 登录失败
    pause
    exit /b 1
)

:: 步骤6：部署到生产环境
echo.
echo [步骤 6/6] 开始部署到生产环境...
echo.
echo 🚀 正在部署...
echo.
vercel --prod
if errorlevel 1 (
    color 0C
    echo.
    echo ❌ 部署失败
    pause
    exit /b 1
)

:: 部署成功
color 0A
echo.
echo.
echo    ╔════════════════════════════════════════╗
echo    ║        ✅ 部署成功！                  ║
echo    ╚════════════════════════════════════════╝
echo.
echo 🎉 恭喜！AIWEB网站已成功部署到Vercel
echo.
echo 📋 部署信息：
echo    • 访问地址已显示在上方
echo    • 可以立即访问测试
echo    • 分享链接给任何人访问
echo.
echo 📖 后续操作：
echo    1. 访问部署URL，测试所有功能
echo    2. 在Vercel Dashboard绑定自定义域名
echo    3. 配置环境变量（如果需要）
echo    4. 设置GitHub自动部署
echo.
echo 💡 提示：
echo    • 每次推送到GitHub会自动部署
echo    • 可在 https://vercel.com/dashboard 管理项目
echo.
pause
