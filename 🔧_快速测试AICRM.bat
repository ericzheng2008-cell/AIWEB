@echo off
chcp 65001 >nul
color 0A

echo ========================================
echo   🔧 AICRM卡片快速测试工具
echo ========================================
echo.

echo 📋 执行步骤：
echo.
echo 1️⃣  正在打开诊断页面...
start "" "🔍_AICRM卡片打不开问题诊断.html"
timeout /t 2 /nobreak >nul

echo 2️⃣  正在直接访问AICRM页面...
start "" "http://localhost:3006/mingsheng-aicrm"
timeout /t 2 /nobreak >nul

echo 3️⃣  正在打开主页...
start "" "http://localhost:3006"
timeout /t 1 /nobreak >nul

echo.
echo ========================================
echo   ✅ 已打开以下页面：
echo ========================================
echo   📄 诊断指南页面
echo   🎯 AICRM直接访问 (http://localhost:3006/mingsheng-aicrm)
echo   🏠 主页 (http://localhost:3006)
echo.
echo 💡 测试步骤：
echo.
echo   步骤1: 查看"AICRM直接访问"窗口
echo          - 如果能正常显示，说明组件正常
echo          - 如果显示空白，按F12查看Console错误
echo.
echo   步骤2: 在主页窗口点击"明升AICRM智能助手"卡片
echo          - 如果能跳转，说明问题已解决
echo          - 如果不能跳转，查看诊断页面的解决方案
echo.
echo   步骤3: 如果仍有问题
echo          - 按F12打开开发者工具
echo          - 切换到Console标签页
echo          - 复制错误信息
echo.
echo 🔍 常见问题：
echo   • 页面空白 → 清除浏览器缓存 (Ctrl+Shift+Delete)
echo   • 点击无反应 → 检查Console是否有错误
echo   • 404错误 → 检查开发服务器是否运行
echo.
pause
