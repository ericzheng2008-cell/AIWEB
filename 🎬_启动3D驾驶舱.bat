@echo off
chcp 65001 >nul
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║          🎬 3D数字监控驾驶舱 - 拧紧数据采集系统          ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo.
echo ┌─────────────────────────────────────────────────────────┐
echo │  🚀 正在启动服务...                                      │
echo └─────────────────────────────────────────────────────────┘
echo.

REM 检测当前运行端口
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :300[0-9] ^| findstr LISTENING') do (
    set PORT=%%a
    goto :found_port
)

:found_port
if defined PORT (
    echo ✅ 服务器已在运行
) else (
    echo ⚠️ 服务器未启动,请先运行: npm run dev
    timeout /t 3 >nul
    exit /b
)

echo.
echo ┌─────────────────────────────────────────────────────────┐
echo │  🎨 3D动态效果清单                                      │
echo └─────────────────────────────────────────────────────────┘
echo.
echo   🌌 背景特效
echo      ✨ 50个粒子动态漂浮上升旋转
echo      ⚡ 8条数据流光扫描效果
echo      🌟 多层渐变色光晕背景
echo.
echo   🎯 工具栏动画
echo      🔄 Logo 3D Y轴旋转 (6秒循环)
echo      ✨ 标题渐变流动效果 (三色循环)
echo      💚 连接状态脉冲动画 (2秒扩散)
echo      🌊 采集中波浪扫描效果
echo      🔘 3D按钮悬浮交互反馈
echo.
echo   🃏 小工具卡片
echo      🎭 翻转进入出现动画 (0.8s弹性)
echo      💎 悬停光效背景 (三色渐变)
echo      ⚡ 边框扫描线动画 (3秒循环)
echo      🎪 3D悬浮效果 (上浮8px + 倾斜5度)
echo      🌟 头部旋转光束扫描
echo      🎯 操作按钮3D Z轴交互
echo.
echo   🎨 选择器对话框
echo      🪟 磨砂玻璃背景 (backdrop-filter)
echo      🃏 卡片3D翻转动画 (倾斜10度)
echo      💫 图标Y轴360度旋转
echo      🌊 涟漪扩散动画 (1秒)
echo      💎 颜色光晕跟随效果
echo.
echo ┌─────────────────────────────────────────────────────────┐
echo │  🎮 交互体验指南                                        │
echo └─────────────────────────────────────────────────────────┘
echo.
echo   1️⃣  观察背景粒子上浮和数据流线滚动
echo   2️⃣  鼠标悬停小工具卡片查看3D悬浮效果
echo   3️⃣  点击工具栏按钮体验3D按压反馈
echo   4️⃣  点击"添加小工具"查看选择器3D卡片
echo   5️⃣  滚动页面查看渐变色滚动条效果
echo.
echo ┌─────────────────────────────────────────────────────────┐
echo │  📊 技术特性                                            │
echo └─────────────────────────────────────────────────────────┘
echo.
echo   🎨 CSS 3D Transform 全面应用
echo   ⚡ GPU硬件加速优化
echo   💫 弹性缓动曲线 cubic-bezier(0.34, 1.56, 0.64, 1)
echo   🌟 多重光效叠加系统
echo   🎭 物理感交互反馈
echo   📈 保持60FPS流畅度
echo.
echo ┌─────────────────────────────────────────────────────────┐
echo │  🎬 正在打开3D驾驶舱...                                 │
echo └─────────────────────────────────────────────────────────┘
echo.

REM 尝试常用端口
for %%p in (3004 3002 3003 3001 3000) do (
    netstat -ano | findstr :%%p | findstr LISTENING >nul
    if !errorlevel! equ 0 (
        echo ✅ 在端口 %%p 找到运行中的服务
        start http://localhost:%%p/tightening-dashboard
        goto :opened
    )
)

:opened
timeout /t 2 /nobreak >nul
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║          🎉 3D驾驶舱已启动！享受视觉盛宴！               ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 💡 提示: 如果页面未自动打开,请手动访问:
echo    http://localhost:3004/tightening-dashboard
echo.
pause
