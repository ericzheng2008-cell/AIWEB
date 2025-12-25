@echo off
chcp 65001 >nul
title Vercel部署闪退问题诊断
color 0E

echo.
echo    ╔═══════════════════════════════════════════════════╗
echo    ║   🔍 Vercel部署闪退问题诊断工具               ║
echo    ╚═══════════════════════════════════════════════════╝
echo.
echo    正在分析闪退原因...
echo.

cd /d "%~dp0"

:: 诊断1：检查Node.js版本
echo [诊断 1/8] 检查Node.js版本...
node --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ❌ Node.js未安装！
    echo 请访问 https://nodejs.org 下载安装
    pause
    exit /b 1
)
node --version
echo ✅ Node.js已安装

:: 诊断2：检查Vercel CLI
echo.
echo [诊断 2/8] 检查Vercel CLI...
vercel --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Vercel CLI未安装
    echo 正在安装...
    call npm install -g vercel
    if errorlevel 1 (
        color 0C
        echo ❌ Vercel CLI安装失败
        pause
        exit /b 1
    )
)
vercel --version
echo ✅ Vercel CLI已就绪

:: 诊断3：检查项目依赖
echo.
echo [诊断 3/8] 检查项目依赖...
if not exist node_modules (
    echo ⚠️  依赖未安装
    echo 正在安装依赖...
    call npm install
    if errorlevel 1 (
        color 0C
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
)
echo ✅ 依赖已安装

:: 诊断4：检查package.json
echo.
echo [诊断 4/8] 检查package.json配置...
if not exist package.json (
    color 0C
    echo ❌ package.json不存在
    pause
    exit /b 1
)
findstr /C:"\"build\"" package.json >nul
if errorlevel 1 (
    color 0C
    echo ❌ package.json缺少build脚本
    pause
    exit /b 1
)
echo ✅ package.json配置正确

:: 诊断5：检查vercel.json
echo.
echo [诊断 5/8] 检查vercel.json配置...
if not exist vercel.json (
    echo ⚠️  vercel.json不存在，正在创建...
    (
        echo {
        echo   "buildCommand": "npm run build",
        echo   "outputDirectory": "dist",
        echo   "framework": "vue",
        echo   "rewrites": [
        echo     {
        echo       "source": "/(.*)",
        echo       "destination": "/index.html"
        echo     }
        echo   ]
        echo }
    ) > vercel.json
    echo ✅ vercel.json已创建
) else (
    echo ✅ vercel.json已存在
)

:: 诊断6：检查vite.config.js
echo.
echo [诊断 6/8] 检查vite.config.js...
if not exist vite.config.js (
    color 0C
    echo ❌ vite.config.js不存在
    pause
    exit /b 1
)
findstr /C:"sourcemap: false" vite.config.js >nul
if errorlevel 1 (
    echo ⚠️  sourcemap未禁用，可能导致构建失败
) else (
    echo ✅ sourcemap已正确配置
)

:: 诊断7：清理旧文件
echo.
echo [诊断 7/8] 清理旧的构建文件...
if exist dist (
    echo 删除 dist 目录...
    rmdir /s /q dist
)
if exist node_modules\.vite (
    echo 删除 .vite 缓存...
    rmdir /s /q node_modules\.vite
)
echo ✅ 清理完成

:: 诊断8：测试构建
echo.
echo [诊断 8/8] 测试本地构建...
echo 这可能需要1-3分钟...
echo.

set NODE_OPTIONS=--max_old_space_size=4096
call npm run build

if errorlevel 1 (
    color 0C
    echo.
    echo ╔═══════════════════════════════════════════════════╗
    echo ║          ❌ 构建测试失败                        ║
    echo ╚═══════════════════════════════════════════════════╝
    echo.
    echo 🔍 闪退原因分析：
    echo.
    echo 常见原因：
    echo   1️⃣  语法错误（检查上方错误信息）
    echo   2️⃣  导入路径错误
    echo   3️⃣  缺少组件或依赖
    echo   4️⃣  内存不足
    echo.
    echo 💡 解决建议：
    echo.
    echo   方案A - 查看详细错误：
    echo     向上滚动查看红色错误信息
    echo.
    echo   方案B - 修复常见问题：
    echo     运行：⚡_修复Vercel部署_2025-12-25.bat
    echo.
    echo   方案C - 手动排查：
    echo     1. 检查 src/components/BehaviorModelPanel.vue
    echo     2. 检查 src/views/MingShengAICRM_V3.vue
    echo     3. 确保所有导入的组件都存在
    echo.
    echo   方案D - 增加内存：
    echo     set NODE_OPTIONS=--max_old_space_size=8192
    echo     npm run build
    echo.
    pause
    exit /b 1
)

:: 构建成功
color 0A
echo.
echo ╔═══════════════════════════════════════════════════╗
echo ║          ✅ 诊断完成 - 一切正常！              ║
echo ╚═══════════════════════════════════════════════════╝
echo.
echo 📊 诊断结果：
echo   ✅ Node.js: 正常
echo   ✅ Vercel CLI: 正常
echo   ✅ 项目依赖: 正常
echo   ✅ 配置文件: 正常
echo   ✅ 本地构建: 成功
echo.
echo 🎯 下一步操作：
echo.
echo   选项1 - 立即部署到Vercel:
echo     双击运行：⭐_立即部署到Vercel_2025-12-25.bat
echo.
echo   选项2 - 手动部署:
echo     1. vercel login
echo     2. vercel --prod
echo.
echo   选项3 - GitHub自动部署:
echo     1. 推送到GitHub
echo     2. 在Vercel连接仓库
echo     3. 自动触发部署
echo.
echo 💡 提示：
echo   • 如果部署时闪退，请在命令窗口中运行
echo   • 不要直接双击bat文件
echo   • 确保网络连接稳定
echo.

pause
