@echo off
chcp 65001 >nul
echo.
echo ====================================
echo   测试销售漏斗时间线布局
echo ====================================
echo.
echo 🎯 测试内容：
echo    1. 时间线式纵向布局（左-中-右三列）
echo    2. 左侧：漏斗形状+阶段名称+时间线连接线
echo    3. 中间：赢率卡片（大数字+趋势+进度条）
echo    4. 右侧：标志事件（可多选/多填）
echo.
echo 🌐 访问路径：
echo    http://localhost:3002/mingsheng-aicrm
echo    → 点击任意商机卡片
echo    → 查看时间线式销售漏斗
echo.
echo 📱 测试重点：
echo    ✓ 漏斗从上到下逐渐变窄（梯形）
echo    ✓ 赢率卡片居中显示，大字体+趋势箭头
echo    ✓ 标志事件支持多个，显示影响值
echo    ✓ 时间线连接线带向下箭头
echo    ✓ 点击展开查看详细分析
echo.
echo ⚡ 开始测试...
start http://localhost:3002/mingsheng-aicrm
echo.
echo ✅ 浏览器已打开！请用 Ctrl+F5 强制刷新
pause
