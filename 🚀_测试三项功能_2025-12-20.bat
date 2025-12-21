@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🚀 测试三项功能升级
echo ========================================
echo.
echo 📋 测试清单：
echo.
echo ✅ 1. 工作流节点放大（360px）
echo    - 访问：/#/workflow-editor-v5
echo    - 节点应为360px（原240px）
echo    - 拖动流畅，无抖动
echo    - CPU < 20%%
echo.
echo ✅ 2. AI工作流平台卡片（9个平台）
echo    - 首页向下滚动
echo    - 找到"AI工作流平台"板块
echo    - 绿色渐变背景
echo    - 9个平台卡片（3列布局）
echo    - 点击跳转到官网
echo.
echo ✅ 3. 明星产品卡片缩小30%%
echo    - 首页"明星产品"板块
echo    - 3列布局（原2列）
echo    - 卡片明显缩小
echo    - 媒体高度196px（原280px）
echo.
echo ========================================
echo.
echo 🌐 正在打开浏览器...
echo.

timeout /t 2 /nobreak >nul
start http://localhost:3000

echo.
echo ✅ 浏览器已打开！
echo.
echo 📝 测试步骤：
echo.
echo 1️⃣  首页查看"明星产品"（3列，卡片缩小）
echo.
echo 2️⃣  向下滚动到"AI工作流平台"（9个卡片）
echo    点击任意卡片测试链接跳转
echo.
echo 3️⃣  点击导航栏"AI工作流智能体"
echo    - 或访问 /#/workflow-editor-v5
echo    - 测试节点拖拽（360px，无抖动）
echo.
echo ========================================
echo.
pause
