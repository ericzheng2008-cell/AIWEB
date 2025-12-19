@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🤖 AI人形助手 - 全新体验
echo ========================================
echo.
echo 📋 设计特点：
echo   ✅ 现代未来主义AI助手形象
echo   ✅ 银白色金属质感
echo   ✅ 青蓝色发光眼睛（呼吸效果）
echo   ✅ 科技纹理装饰
echo   ✅ 优雅的人形轮廓
echo.
echo ✨ 动画效果：
echo   ✓ 整体悬浮漂浮
echo   ✓ 眼睛呼吸发光
echo   ✓ 颈部发光线条
echo   ✓ 肩部旋转光环
echo   ✓ 外围扩散光晕
echo   ✓ 悬停时眨眼互动
echo   ✓ 头部倾斜动作
echo.
echo 🎨 配色方案：
echo   - 银白色：头部和肩部
echo   - 深色：发型
echo   - 青蓝色：眼睛和发光元素
echo.
echo 🎯 测试步骤：
echo   1. 访问网站任意页面
echo   2. 查看右下角的AI人形助手
echo   3. 观察悬浮和发光动画
echo   4. 鼠标悬停查看眨眼效果
echo   5. 点击打开聊天窗口
echo.
echo 🌐 正在启动开发服务器...
echo.

cd /d "%~dp0"
start http://localhost:5173
npm run dev

pause
