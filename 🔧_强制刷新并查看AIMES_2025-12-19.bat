@echo off
chcp 65001 >nul
echo ========================================
echo 强制刷新并查看AIMES卡片
echo ========================================
echo.
echo 正在执行以下操作：
echo.
echo [1/3] 停止所有Node进程...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo [2/3] 清除浏览器缓存提示...
echo.
echo ⚠️ 重要提示：
echo 页面打开后，请按 Ctrl + Shift + R 强制刷新！
echo.

echo [3/3] 启动开发服务器并打开页面...
cd /d "%~dp0"
start /B cmd /c "npm run dev"
timeout /t 5 >nul

start http://localhost:5173/#/aicrm?tab=aiAgent

echo.
echo ========================================
echo ✅ 操作完成！
echo ========================================
echo.
echo 📋 检查清单：
echo [ ] 页面已打开AI智能体标签
echo [ ] 已按 Ctrl+Shift+R 强制刷新
echo [ ] 可以看到4个智能体卡片：
echo     1. 赢率预测引擎 (蓝色)
echo     2. 客户意向分析 (绿色)
echo     3. 行动推荐助手 (橙色)
echo     4. AIMES 智能制造助手 (紫色) ⭐
echo.
echo 🔍 如果仍然看不到AIMES卡片：
echo 1. 打开诊断工具: 🔍_诊断AIMES卡片显示_2025-12-19.html
echo 2. 检查浏览器控制台是否有错误（F12）
echo 3. 尝试向下滚动页面
echo 4. 使用无痕模式打开
echo.
pause
