@echo off
chcp 65001 >nul
echo ========================================
echo 🔧 修复 Phase 2-4 页面显示问题
echo ========================================
echo.

cd /d "%~dp0"

echo [步骤 1/5] 清除浏览器缓存数据...
echo 正在清除 localStorage...
echo.

echo 请在浏览器中按 F12 打开控制台，然后执行以下命令：
echo.
echo localStorage.clear()
echo location.reload()
echo.

pause

echo.
echo [步骤 2/5] 检查依赖包...
call npm list marked
echo.

echo [步骤 3/5] 检查 Store 文件...
if exist "src\store\knowledgeBase.js" (
    echo ✅ knowledgeBase.js 存在
) else (
    echo ❌ knowledgeBase.js 不存在
)

if exist "src\store\learningEngine.js" (
    echo ✅ learningEngine.js 存在
) else (
    echo ❌ learningEngine.js 不存在
)

if exist "src\store\monitoringSystem.js" (
    echo ✅ monitoringSystem.js 存在
) else (
    echo ❌ monitoringSystem.js 不存在
)

if exist "src\store\agentRegistry.js" (
    echo ✅ agentRegistry.js 存在
) else (
    echo ❌ agentRegistry.js 不存在
)

echo.
echo [步骤 4/5] 检查组件文件...
if exist "src\views\admin\KnowledgeBase.vue" (
    echo ✅ KnowledgeBase.vue 存在
) else (
    echo ❌ KnowledgeBase.vue 不存在
)

if exist "src\views\admin\LearningEngine.vue" (
    echo ✅ LearningEngine.vue 存在
) else (
    echo ❌ LearningEngine.vue 不存在
)

if exist "src\views\admin\MonitoringDashboard.vue" (
    echo ✅ MonitoringDashboard.vue 存在
) else (
    echo ❌ MonitoringDashboard.vue 不存在
)

echo.
echo [步骤 5/5] 重启开发服务器...
echo.

echo 请按 Ctrl+C 停止当前开发服务器
echo 然后运行此脚本继续
pause

echo.
echo 正在启动开发服务器...
call npm run dev

pause
