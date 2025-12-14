@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    🚀 智能体增强版快速体验
echo ========================================
echo.
echo 正在启动开发服务器...
echo.
cd /d "%~dp0"

start "" "http://localhost:3002/tool-selector-enhanced"

echo ✅ 已在浏览器中打开增强版页面
echo.
echo 📌 体验要点：
echo   1. 观察顶部智能体状态栏
echo   2. 等待2秒看主动建议
echo   3. 填写表单感受实时反应
echo   4. 查看底部活动日志
echo.
echo 📊 对比测试：
echo   原版: http://localhost:3002/tool-selector
echo   增强版: http://localhost:3002/tool-selector-enhanced
echo.
pause
