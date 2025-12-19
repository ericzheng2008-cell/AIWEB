@echo off
chcp 65001 >nul
echo ================================
echo   沙盘分析功能测试工具
echo ================================
echo.
echo 正在打开诊断页面...
start "" "🔍_诊断沙盘问题.html"
echo.
echo 正在打开AICRM系统...
timeout /t 2 /nobreak >nul
start "" "http://localhost:3003/mingsheng-aicrm"
echo.
echo ================================
echo   测试步骤：
echo ================================
echo 1. 等待页面加载完成
echo 2. 点击顶部导航栏"客户沙盘"
echo 3. 在左侧客户列表选择任意客户
echo 4. 测试以下功能：
echo    - 3D沙盘视图
echo    - 时间线视图
echo    - 矩阵图视图
echo    - 策略推荐按钮
echo    - 导出报告按钮
echo.
echo 如遇到问题，请按F12查看控制台错误
echo ================================
pause
