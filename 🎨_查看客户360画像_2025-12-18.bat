@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    查看客户360画像与沙盘分析
echo ========================================
echo.
echo 📍 前台访问路径：
echo    首页 → 营销板块 → 明升AICRM → 客户360°
echo.
echo 📍 后台管理路径：
echo    http://localhost:3004/admin/customer360
echo.
echo ========================================
echo    核心功能
echo ========================================
echo.
echo ✅ 客户360画像
echo    • 8大维度数据展示
echo    • 健康分评估
echo    • 风险预警
echo    • 联系人网络
echo.
echo ✅ 客户沙盘分析
echo    • 营收预测
echo    • 风险分析
echo    • 机会识别
echo    • 场景模拟
echo.
echo ========================================
echo.

start http://localhost:3004/

echo.
echo ✨ 浏览器已打开，请在AICRM中点击"客户360°"菜单
echo.
pause
