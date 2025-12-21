@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🚀 测试三项优化功能
echo ========================================
echo.
echo 📋 测试清单：
echo.
echo ✅ 1. 首页滚动量优化
echo    - section padding: 80px → 50px
echo    - 整页高度减少约24%%
echo.
echo ✅ 2. AI工作流平台（29个）
echo    - 新增13个平台链接
echo    - 钉钉/飞书/腾讯元器等
echo.
echo ✅ 3. AI营销平台分析
echo    - 查看分析报告
echo    - 查看优化方案
echo.
echo ========================================
echo.
pause
echo.
echo 正在启动开发服务器...
cd /d "%~dp0"
start cmd /k "npm run dev"
timeout /t 3 >nul

echo.
echo 🌐 正在打开浏览器...
timeout /t 5 >nul
start http://localhost:3002

echo.
echo 📊 打开分析报告...
start "" "📊_AI国际营销平台使用效果分析报告_2025-12-21.md"

echo.
echo 🎯 打开优化方案...
start "" "🎯_AI营销平台快速优化方案_2025-12-21.md"

echo.
echo ========================================
echo   ✅ 测试环境已就绪！
echo ========================================
echo.
echo 📋 测试步骤：
echo.
echo 1️⃣ 首页滚动测试
echo    - 从顶部滚动到底部
echo    - 观察滚动量是否明显减少
echo.
echo 2️⃣ 工作流平台测试
echo    - 点击"AI工作流平台"卡片
echo    - 查看弹窗是否显示29个平台
echo    - 随机点击几个平台链接测试
echo.
echo 3️⃣ 营销平台分析
echo    - 阅读分析报告（综合评分4.2/5）
echo    - 查看优化方案（2个可选方案）
echo.
echo ========================================
pause
