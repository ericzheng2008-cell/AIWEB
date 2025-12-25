@echo off
chcp 65001 >nul
color 0B

:: 防止窗口闪退
title AIWEB - Vercel一键修复并部署

echo.
echo ╔══════════════════════════════════════════════════╗
echo ║   🚀 AIWEB - Vercel一键修复并部署             ║
echo ╠══════════════════════════════════════════════════╣
echo ║   本工具将自动完成：                           ║
echo ║   ✅ 清理旧文件                                ║
echo ║   ✅ 检查并安装依赖                            ║
echo ║   ✅ 修复构建配置                              ║
echo ║   ✅ 本地构建测试                              ║
echo ║   ✅ 登录Vercel                                ║
echo ║   ✅ 部署到生产环境                            ║
echo ║                                                  ║
echo ║   💡 窗口不会自动关闭，请耐心等待             ║
echo ╚══════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

:: 设置错误处理
setlocal EnableDelayedExpansion

:: 步骤计数
set STEP=0
set TOTAL=6

:: ========== 步骤1：清理旧文件 ==========
set /a STEP+=1
echo.
echo ┌──────────────────────────────────────────────────┐
echo │ [!STEP!/!TOTAL!] 清理旧文件                      │
echo └──────────────────────────────────────────────────┘
echo.

if exist dist (
    echo 正在删除 dist...
    rmdir /s /q dist 2>nul
    echo ✅ dist 已删除
)

if exist node_modules\.vite (
    echo 正在删除 .vite 缓存...
    rmdir /s /q node_modules\.vite 2>nul
    echo ✅ .vite 缓存已清除
)

echo ✅ 清理完成
timeout /t 1 >nul

:: ========== 步骤2：检查环境 ==========
set /a STEP+=1
echo.
echo ┌──────────────────────────────────────────────────┐
echo │ [!STEP!/!TOTAL!] 检查环境                        │
echo └──────────────────────────────────────────────────┘
echo.

echo 检查 Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ❌ Node.js 未安装
    echo.
    echo 请先安装 Node.js: https://nodejs.org
    echo.
    goto :error_exit
)
echo ✅ Node.js 已安装

echo.
echo 检查 Vercel CLI...
vercel --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Vercel CLI 未安装，正在安装...
    echo.
    call npm install -g vercel
    if errorlevel 1 (
        color 0C
        echo ❌ Vercel CLI 安装失败
        echo.
        goto :error_exit
    )
    echo ✅ Vercel CLI 安装成功
) else (
    echo ✅ Vercel CLI 已安装
)

timeout /t 1 >nul

:: ========== 步骤3：安装依赖 ==========
set /a STEP+=1
echo.
echo ┌──────────────────────────────────────────────────┐
echo │ [!STEP!/!TOTAL!] 安装依赖                        │
echo └──────────────────────────────────────────────────┘
echo.

if not exist node_modules (
    echo 正在安装依赖，请稍候...
    echo （这可能需要3-5分钟）
    echo.
    call npm install
    if errorlevel 1 (
        color 0C
        echo ❌ 依赖安装失败
        echo.
        goto :error_exit
    )
    echo ✅ 依赖安装完成
) else (
    echo ✅ 依赖已存在
)

timeout /t 1 >nul

:: ========== 步骤4：本地构建 ==========
set /a STEP+=1
echo.
echo ┌──────────────────────────────────────────────────┐
echo │ [!STEP!/!TOTAL!] 本地构建测试                    │
echo └──────────────────────────────────────────────────┘
echo.

echo ⏳ 正在构建项目...
echo （这可能需要1-3分钟）
echo.

:: 设置内存限制
set NODE_OPTIONS=--max_old_space_size=4096

call npm run build

if errorlevel 1 (
    color 0C
    echo.
    echo ╔══════════════════════════════════════════════════╗
    echo ║   ❌ 构建失败                                  ║
    echo ╚══════════════════════════════════════════════════╝
    echo.
    echo 🔍 请检查上方的错误信息
    echo.
    echo 💡 可能的解决方案：
    echo    1. 检查语法错误
    echo    2. 检查导入路径
    echo    3. 运行诊断工具：🔧_Vercel部署诊断_2025-12-25.bat
    echo.
    goto :error_exit
)

echo.
echo ✅ 构建成功！
timeout /t 2 >nul

:: ========== 步骤5：登录Vercel ==========
set /a STEP+=1
echo.
echo ┌──────────────────────────────────────────────────┐
echo │ [!STEP!/!TOTAL!] 登录Vercel                      │
echo └──────────────────────────────────────────────────┘
echo.

echo 💡 浏览器即将打开，请在浏览器中完成授权
echo.
echo 按任意键继续...
pause >nul

echo.
vercel login

if errorlevel 1 (
    color 0C
    echo.
    echo ❌ 登录失败
    echo.
    echo 💡 请确保：
    echo    1. 浏览器已打开
    echo    2. 已完成授权
    echo    3. 网络连接正常
    echo.
    goto :error_exit
)

echo.
echo ✅ 登录成功
timeout /t 2 >nul

:: ========== 步骤6：部署 ==========
set /a STEP+=1
echo.
echo ┌──────────────────────────────────────────────────┐
echo │ [!STEP!/!TOTAL!] 部署到生产环境                  │
echo └──────────────────────────────────────────────────┘
echo.

echo 🚀 正在部署...
echo （这可能需要2-5分钟）
echo.

vercel --prod

if errorlevel 1 (
    color 0C
    echo.
    echo ╔══════════════════════════════════════════════════╗
    echo ║   ❌ 部署失败                                  ║
    echo ╚══════════════════════════════════════════════════╝
    echo.
    echo 💡 可能的原因：
    echo    1. 网络连接问题
    echo    2. Vercel服务器繁忙
    echo    3. 账户权限问题
    echo.
    echo 🔄 建议：
    echo    1. 检查网络连接
    echo    2. 稍后重试
    echo    3. 访问 Vercel Dashboard 查看详情
    echo.
    goto :error_exit
)

:: ========== 部署成功 ==========
color 0A
echo.
echo.
echo ╔══════════════════════════════════════════════════╗
echo ║              ✅ 部署成功！                     ║
echo ╚══════════════════════════════════════════════════╝
echo.
echo 🎉 恭喜！AIWEB已成功部署到Vercel
echo.
echo 📋 部署信息：
echo    • 访问地址显示在上方
echo    • 支持全球访问
echo    • 自动HTTPS
echo    • CDN加速
echo.
echo 📖 下一步：
echo    1️⃣  访问部署URL测试
echo    2️⃣  在Vercel Dashboard绑定域名
echo    3️⃣  配置环境变量（如需要）
echo    4️⃣  设置GitHub自动部署
echo.
echo 💡 提示：
echo    Vercel Dashboard: https://vercel.com/dashboard
echo.

echo.
echo 是否在浏览器中打开Vercel Dashboard？[Y/N]
choice /C YN /N /M "请选择: "

if errorlevel 2 goto :success_exit
echo.
echo 正在打开浏览器...
start https://vercel.com/dashboard
goto :success_exit

:: ========== 错误退出 ==========
:error_exit
echo.
echo ╔══════════════════════════════════════════════════╗
echo ║          ⚠️  部署过程中出现错误                ║
echo ╚══════════════════════════════════════════════════╝
echo.
echo 📖 查看解决方案：
echo    📋_Vercel闪退问题解决清单_2025-12-25.md
echo.
echo 🔧 运行诊断工具：
echo    🔧_Vercel部署诊断_2025-12-25.bat
echo.
echo 💬 获取帮助：
echo    查看 📖_Vercel部署完整指南_2025-12-25.md
echo.
pause
exit /b 1

:: ========== 成功退出 ==========
:success_exit
echo.
echo ══════════════════════════════════════════════════
echo   🎊 所有步骤完成！
echo ══════════════════════════════════════════════════
echo.
pause
exit /b 0
