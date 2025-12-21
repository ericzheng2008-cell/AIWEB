@echo off
chcp 65001 >nul
echo.
echo ============================================
echo    🧪 测试核心智能体平台 - 验证删除效果
echo ============================================
echo.
echo 📋 验证要点：
echo    1. 首页不再有独立的"明升企业智能体"板块
echo    2. "核心智能体平台"双卡片正常显示
echo    3. 页面布局更简洁紧凑
echo    4. 没有样式错误
echo.
echo ⏳ 正在启动浏览器...
timeout /t 2 >nul
start http://localhost:3002
echo.
echo ✅ 浏览器已打开！
echo.
echo 🔍 请检查：
echo    - 首页Banner下方是否直接是"核心智能体平台"
echo    - 是否没有单独的"明升企业智能体"板块
echo    - 双卡片布局是否正常显示
echo.
pause
