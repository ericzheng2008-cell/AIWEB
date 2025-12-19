@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🤖 球形智能机器人 - 即刻体验
echo ========================================
echo.
echo 📋 功能特性：
echo   ✅ BB-8风格的球形机器人设计
echo   ✅ 双层结构（头部 + 球体）
echo   ✅ 蓝色发光眼睛（呼吸动画）
echo   ✅ 橙色装饰圈和指示灯
echo   ✅ 红色闪烁天线
echo   ✅ 悬浮、摆动、眨眼、点头等8种动画
echo.
echo 🎯 测试步骤：
echo   1. 访问网站任意页面
echo   2. 查看右下角的球形机器人
echo   3. 观察悬浮和呼吸动画
echo   4. 鼠标悬停查看互动效果
echo   5. 点击打开聊天窗口
echo.
echo 🌐 正在启动开发服务器...
echo.

cd /d "%~dp0"
start http://localhost:5173
npm run dev

pause
