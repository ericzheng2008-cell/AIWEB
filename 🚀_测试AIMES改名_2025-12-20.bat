@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🚀 测试 AIMES 改名效果
echo ========================================
echo.
echo 📋 改名内容：
echo   - AIMES智能制造 → AIMES助手
echo   - AIMES 智能制造助手 → AIMES助手
echo.
echo 🎯 测试位置：
echo   1. 首页 - 智能体板块第2排第4个卡片
echo   2. AICRM V3 - 导航栏菜单项
echo   3. AI智能体 - 第4个卡片
echo.
echo 🌐 正在打开浏览器...
echo.

timeout /t 2 >nul
start http://localhost:3002

echo.
echo ✅ 浏览器已打开！
echo.
echo 📝 验证步骤：
echo   1. 查看首页智能体板块 → 找到"AIMES助手"
echo   2. 点击卡片 → 进入AICRM V3系统
echo   3. 查看导航栏 → 显示"AIMES助手"
echo   4. 切换到"AI智能体"标签 → 查看第4个卡片
echo.
echo 🎉 所有位置的名称都应该显示为"AIMES助手"
echo.
pause
