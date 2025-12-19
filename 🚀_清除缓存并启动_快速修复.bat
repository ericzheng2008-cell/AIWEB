@echo off
chcp 65001 >nul
cls

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║      🚀 快速修复 Phase 2-4 页面显示问题               ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo [提示] 此脚本将帮助您解决以下问题：
echo   • 知识库管理页面空白
echo   • 主动学习引擎无响应
echo   • 监控与优化页面无数据
echo.
echo ══════════════════════════════════════════════════════════
echo.

echo 📋 步骤 1/4: 检查文件完整性
echo.

set "files_ok=1"

if not exist "src\store\knowledgeBase.js" (
    echo ❌ knowledgeBase.js 缺失
    set "files_ok=0"
) else (
    echo ✅ knowledgeBase.js
)

if not exist "src\store\learningEngine.js" (
    echo ❌ learningEngine.js 缺失
    set "files_ok=0"
) else (
    echo ✅ learningEngine.js
)

if not exist "src\store\monitoringSystem.js" (
    echo ❌ monitoringSystem.js 缺失
    set "files_ok=0"
) else (
    echo ✅ monitoringSystem.js
)

if not exist "src\views\admin\KnowledgeBase.vue" (
    echo ❌ KnowledgeBase.vue 缺失
    set "files_ok=0"
) else (
    echo ✅ KnowledgeBase.vue
)

if not exist "src\views\admin\LearningEngine.vue" (
    echo ❌ LearningEngine.vue 缺失
    set "files_ok=0"
) else (
    echo ✅ LearningEngine.vue
)

if not exist "src\views\admin\MonitoringDashboard.vue" (
    echo ❌ MonitoringDashboard.vue 缺失
    set "files_ok=0"
) else (
    echo ✅ MonitoringDashboard.vue
)

echo.
if "%files_ok%"=="0" (
    echo ⚠️ 发现文件缺失，请检查！
    pause
    exit /b 1
) else (
    echo ✅ 所有必需文件都存在
)

echo.
echo ══════════════════════════════════════════════════════════
echo.

echo 📋 步骤 2/4: 检查依赖包
echo.
call npm list marked >nul 2>&1
if errorlevel 1 (
    echo ⚠️ marked 未安装，正在安装...
    call npm install marked --save
) else (
    echo ✅ marked 已安装
)

echo.
echo ══════════════════════════════════════════════════════════
echo.

echo 📋 步骤 3/4: 清除浏览器缓存
echo.
echo ⚠️ 重要：请在浏览器中执行以下操作：
echo.
echo   1. 打开浏览器开发者工具 (按 F12)
echo   2. 在 Console 控制台中粘贴以下代码并回车：
echo.
echo   ┌────────────────────────────────────────────┐
echo   │ localStorage.clear();                      │
echo   │ sessionStorage.clear();                    │
echo   │ location.reload(true);                     │
echo   └────────────────────────────────────────────┘
echo.
echo   或者使用快捷键强制刷新：
echo   • Ctrl + Shift + R (Chrome/Edge/Firefox)
echo   • Ctrl + F5 (Windows 通用)
echo.

pause

echo.
echo ══════════════════════════════════════════════════════════
echo.

echo 📋 步骤 4/4: 重启开发服务器
echo.

echo 正在查找并关闭现有的 Node 进程...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo ✅ 已清理旧进程
echo.

echo 🚀 正在启动开发服务器...
echo.
echo ══════════════════════════════════════════════════════════
echo.

start cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ✅ 开发服务器已在新窗口中启动
echo.
echo ══════════════════════════════════════════════════════════
echo.
echo 📝 下一步操作：
echo.
echo 1. 等待服务器启动完成（看到 "Local: http://localhost:5173/"）
echo 2. 在浏览器中访问以下地址进行测试：
echo.
echo    📚 知识库管理:
echo       http://localhost:5173/admin/knowledge
echo.
echo    🧠 主动学习引擎:
echo       http://localhost:5173/admin/learning
echo.
echo    📊 监控与优化:
echo       http://localhost:5173/admin/monitoring
echo.
echo 3. 如果页面仍然空白，请按 F12 查看控制台错误
echo.
echo ══════════════════════════════════════════════════════════
echo.

echo 🎉 修复脚本执行完成！
echo.
echo 如果问题仍然存在，请查看：
echo   📄 ✅_Phase2-4页面问题修复方案_2025-12-15.md
echo   🌐 🔍_诊断Phase2-4页面问题.html
echo.

pause
