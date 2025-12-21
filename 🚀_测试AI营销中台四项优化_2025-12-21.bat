@echo off
chcp 65001 >nul
echo ========================================
echo   测试AI营销中台四项优化
echo ========================================
echo.
echo ✅ 优化1: 分区式大卡片展示
echo ✅ 优化2: 真实客户案例
echo ✅ 优化3: 用户友好数据指标
echo ✅ 优化4: AI智能对话预览
echo.
echo 正在启动开发服务器...
echo.
cd /d "%~dp0"
start http://localhost:5173
npm run dev
pause
