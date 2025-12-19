@echo off
chcp 65001 >nul
echo ====================================
echo     P2-4 行为驱动客户模型测试
echo ====================================
echo.

echo [1/3] 打开浏览器...
timeout /t 2 /nobreak >nul
start http://localhost:3002

echo.
echo [2/3] 等待页面加载...
timeout /t 8 /nobreak >nul

echo.
echo [3/3] 打开完成报告...
start "" "✅_P2-4行为驱动客户模型完成_2025-12-19.md"

echo.
echo ====================================
echo     测试步骤指引
echo ====================================
echo.
echo 1. 进入AICRM主页
echo 2. 点击左侧菜单 → "行为模型"
echo 3. 测试4个标签页:
echo    - 客户行为分析
echo    - 生命周期分布
echo    - 购买倾向预测
echo    - 客户行为路径
echo.
echo 4. 点击"查看详情"测试雷达图
echo 5. 测试导出高倾向客户CSV
echo 6. 创建跟进任务
echo.
echo ====================================
pause
