@echo off
echo ========================================
echo 查看AIMES智能体卡片 - 2025-12-19
echo ========================================
echo.
echo 修复内容:
echo [✓] 调整智能体卡片布局为 span="6" (每行4个)
echo [✓] 确保AIMES智能体卡片在同一行显示
echo.
echo 测试步骤:
echo 1. 访问 http://localhost:5173
echo 2. 点击顶部导航 "AI智能体"
echo 3. 查看智能体卡片区域
echo 4. 确认看到4个智能体卡片在同一行:
echo    - 赢率预测引擎
echo    - 客户意向分析
echo    - 行动推荐助手
echo    - AIMES 智能制造助手 (紫色图标)
echo.
echo 正在启动浏览器...
timeout /t 2 >nul
start http://localhost:5173/#/aicrm?tab=aiAgent
echo.
echo 提示: 如果看不到AIMES卡片，请检查:
echo 1. 页面是否需要向下滚动
echo 2. 浏览器缓存是否需要清除 (Ctrl+Shift+R)
echo.
pause
