@echo off
chcp 65001 >nul
echo ========================================
echo   📱 响应式设计测试工具
echo   测试时间: 2025-12-18
echo ========================================
echo.

echo 🚀 正在启动开发服务器...
echo.

start cmd /k "cd /d C:\Users\EricZ\CodeBuddy\AIWEB1 && npm run dev"

timeout /t 5 >nul

echo.
echo ✅ 服务器已启动！
echo.
echo 📋 测试指南:
echo ----------------------------------------
echo 1. Chrome DevTools测试:
echo    - 按F12打开开发者工具
echo    - 按Ctrl+Shift+M切换设备模式
echo    - 选择不同设备预设
echo.
echo 2. 推荐测试设备:
echo    ✓ iPhone SE (375×667)
echo    ✓ iPhone 12 Pro (390×844)
echo    ✓ iPad Mini (768×1024)
echo    ✓ iPad Pro (1024×1366)
echo.
echo 3. 测试页面:
echo    - 主页: http://localhost:3002/
echo    - AICRM: http://localhost:3002/#/ai-crm-v3
echo    - 客户沙盘: AI-CRM → 客户沙盘
echo.
echo 4. 验证要点:
echo    ✓ 按钮布局（移动端竖排）
echo    ✓ 卡片网格（移动1列/平板2列）
echo    ✓ 图表高度自适应
echo    ✓ 文字大小合适
echo    ✓ 触摸区域足够大
echo.
echo 5. 手机真机测试:
echo    WiFi访问: http://192.168.31.102:3002
echo    (确保手机和电脑在同一网络)
echo.
echo ========================================

start http://localhost:3002/

echo.
echo 🎯 浏览器已自动打开！
echo 💡 开始测试响应式设计吧！
echo.
pause
