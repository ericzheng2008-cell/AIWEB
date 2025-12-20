@echo off
chcp 65001 >nul
echo ========================================
echo 立即测试3002端口修复效果
echo ========================================
echo.
echo ✅ 已应用修复：
echo • 根元素保护规则已添加
echo • 卡片优化继续生效
echo.
echo 🚀 正在打开页面...
start http://localhost:3002

timeout /t 2 >nul

echo.
echo ========================================
echo 📋 验证清单
echo ========================================
echo.
echo [ ] 页面正常显示（不再空白）
echo [ ] 可以看到导航栏和内容
echo [ ] 卡片默认较小（85%%）
echo [ ] 鼠标悬停卡片变大（102%%）
echo [ ] 按 Ctrl+K 可以打开/关闭AI助手
echo.
echo 🔍 如果仍然有问题：
echo 1. 按 F12 查看控制台错误
echo 2. 按 Ctrl+Shift+R 强制刷新
echo 3. 运行完整修复: 🔧_修复3002空白页面_2025-12-19.bat
echo 4. 打开诊断工具: 🔍_诊断3002空白页面_2025-12-19.html
echo.
pause
