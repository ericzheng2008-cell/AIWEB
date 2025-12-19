@echo off
chcp 65001 >nul
cls
color 0A
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║          🚀 3D驾驶舱 - 立即体验                          ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo.
echo 📡 正在检测服务器状态...
echo.

netstat -ano | findstr ":3002" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 服务器正在运行 (端口 3002)
    echo.
    echo 🌐 正在打开浏览器...
    timeout /t 1 /nobreak >nul
    start http://localhost:3002/tightening-dashboard
    echo.
    echo ════════════════════════════════════════════════════════════
    echo.
    echo    ⚠️  重要提示: 如果看到错误,请按 Ctrl+F5 刷新!
    echo.
    echo ════════════════════════════════════════════════════════════
    echo.
) else (
    echo ❌ 服务器未运行
    echo.
    echo 🔧 正在启动开发服务器...
    echo.
    start "开发服务器" cmd /k "cd /d %~dp0 && npm run dev"
    echo.
    echo ⏳ 等待服务器启动 (约15秒)...
    timeout /t 15 /nobreak >nul
    echo.
    echo 🌐 正在打开浏览器...
    start http://localhost:3002/tightening-dashboard
    echo.
)

echo.
echo ════════════════════════════════════════════════════════════
echo   🎮 体验指南
echo ════════════════════════════════════════════════════════════
echo.
echo   1️⃣  观察背景 - 粒子漂浮 + 流线滚动
echo   2️⃣  悬停卡片 - 3D悬浮 + 光效 + 扫描线
echo   3️⃣  点击按钮 - 3D按压反馈
echo   4️⃣  添加小工具 - 选择器3D卡片翻转
echo   5️⃣  滚动页面 - 渐变色滚动条
echo.
echo ════════════════════════════════════════════════════════════
echo   ✨ 12种3D效果
echo ════════════════════════════════════════════════════════════
echo.
echo   ✨  1. 3D粒子背景 (50个)      💎  9. 光效背景系统
echo   ⚡  2. 数据流动背景 (8条)     ⚡  10. 边框扫描线
echo   🔄  3. 3D旋转Logo             🎪  11. 3D卡片悬浮
echo   ✨  4. 渐变流动标题           🃏  12. 选择器3D卡片
echo   💚  5. 脉冲状态指示
echo   🌊  6. 波浪采集动画
echo   🔘  7. 3D按钮交互
echo   🎭  8. 卡片出现动画
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo   📍 访问地址: http://localhost:3002/tightening-dashboard
echo.
echo ════════════════════════════════════════════════════════════
echo.
pause
