@echo off
chcp 65001 >nul
color 0E
title 验证Vercel部署工具

echo.
echo    ╔══════════════════════════════════════════════════╗
echo    ║     🧪 验证Vercel部署工具完整性              ║
echo    ╚══════════════════════════════════════════════════╝
echo.
echo    正在检查所有工具文件...
echo.

cd /d "%~dp0"

set TOTAL=0
set SUCCESS=0
set MISSING=0

:: 检查工具文件
echo ┌──────────────────────────────────────────────────┐
echo │ 核心部署工具                                     │
echo └──────────────────────────────────────────────────┘
echo.

set /a TOTAL+=1
if exist "⭐_Vercel部署启动器_2025-12-25.bat" (
    echo ✅ ⭐_Vercel部署启动器_2025-12-25.bat
    set /a SUCCESS+=1
) else (
    echo ❌ ⭐_Vercel部署启动器_2025-12-25.bat
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "🚀_Vercel一键修复并部署_2025-12-25.bat" (
    echo ✅ 🚀_Vercel一键修复并部署_2025-12-25.bat
    set /a SUCCESS+=1
) else (
    echo ❌ 🚀_Vercel一键修复并部署_2025-12-25.bat
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "⚡_Vercel部署防闪退版_2025-12-25.bat" (
    echo ✅ ⚡_Vercel部署防闪退版_2025-12-25.bat
    set /a SUCCESS+=1
) else (
    echo ❌ ⚡_Vercel部署防闪退版_2025-12-25.bat
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "🔧_Vercel部署诊断_2025-12-25.bat" (
    echo ✅ 🔧_Vercel部署诊断_2025-12-25.bat
    set /a SUCCESS+=1
) else (
    echo ❌ 🔧_Vercel部署诊断_2025-12-25.bat
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "⚡_修复Vercel部署_2025-12-25.bat" (
    echo ✅ ⚡_修复Vercel部署_2025-12-25.bat
    set /a SUCCESS+=1
) else (
    echo ❌ ⚡_修复Vercel部署_2025-12-25.bat
    set /a MISSING+=1
)

echo.
echo ┌──────────────────────────────────────────────────┐
echo │ 文档和指南                                       │
echo └──────────────────────────────────────────────────┘
echo.

set /a TOTAL+=1
if exist "📖_Vercel部署完整指南_2025-12-25.md" (
    echo ✅ 📖_Vercel部署完整指南_2025-12-25.md
    set /a SUCCESS+=1
) else (
    echo ❌ 📖_Vercel部署完整指南_2025-12-25.md
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "📋_Vercel闪退问题解决清单_2025-12-25.md" (
    echo ✅ 📋_Vercel闪退问题解决清单_2025-12-25.md
    set /a SUCCESS+=1
) else (
    echo ❌ 📋_Vercel闪退问题解决清单_2025-12-25.md
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "🌐_Vercel部署快速通道_2025-12-25.html" (
    echo ✅ 🌐_Vercel部署快速通道_2025-12-25.html
    set /a SUCCESS+=1
) else (
    echo ❌ 🌐_Vercel部署快速通道_2025-12-25.html
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "✅_Vercel闪退问题完整解决方案_2025-12-25.md" (
    echo ✅ ✅_Vercel闪退问题完整解决方案_2025-12-25.md
    set /a SUCCESS+=1
) else (
    echo ❌ ✅_Vercel闪退问题完整解决方案_2025-12-25.md
    set /a MISSING+=1
)

echo.
echo ┌──────────────────────────────────────────────────┐
echo │ 配置文件                                         │
echo └──────────────────────────────────────────────────┘
echo.

set /a TOTAL+=1
if exist "vercel.json" (
    echo ✅ vercel.json
    set /a SUCCESS+=1
) else (
    echo ❌ vercel.json
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "vite.config.js" (
    echo ✅ vite.config.js
    set /a SUCCESS+=1
) else (
    echo ❌ vite.config.js
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "package.json" (
    echo ✅ package.json
    set /a SUCCESS+=1
) else (
    echo ❌ package.json
    set /a MISSING+=1
)

:: 统计结果
echo.
echo ════════════════════════════════════════════════════
echo   验证结果
echo ════════════════════════════════════════════════════
echo.
echo   总计: %TOTAL% 个文件
echo   成功: %SUCCESS% 个
echo   缺失: %MISSING% 个
echo.

if %MISSING%==0 (
    color 0A
    echo ╔══════════════════════════════════════════════════╗
    echo ║          ✅ 所有工具文件完整！               ║
    echo ╚══════════════════════════════════════════════════╝
    echo.
    echo 🎉 恭喜！所有Vercel部署工具已就绪
    echo.
    echo 📖 下一步：
    echo    1️⃣  查看完整解决方案
    echo       ✅_Vercel闪退问题完整解决方案_2025-12-25.md
    echo.
    echo    2️⃣  打开部署启动器
    echo       ⭐_Vercel部署启动器_2025-12-25.bat
    echo.
    echo    3️⃣  查看可视化指南
    echo       🌐_Vercel部署快速通道_2025-12-25.html
    echo.
) else (
    color 0C
    echo ╔══════════════════════════════════════════════════╗
    echo ║          ⚠️  部分工具文件缺失               ║
    echo ╚══════════════════════════════════════════════════╝
    echo.
    echo 💡 解决方案：
    echo    1. 检查文件是否被删除
    echo    2. 重新下载项目文件
    echo    3. 联系技术支持
    echo.
)

echo 是否打开部署启动器？[Y/N]
choice /C YN /N /M "请选择: "

if errorlevel 2 goto end

echo.
if exist "⭐_Vercel部署启动器_2025-12-25.bat" (
    echo 正在启动...
    call "⭐_Vercel部署启动器_2025-12-25.bat"
) else (
    echo ❌ 启动器文件不存在
)

:end
echo.
pause
