@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🎬 体验3D数字监控驾驶舱
echo ========================================
echo.
echo 正在启动3D驾驶舱...
echo.
start http://localhost:3002/tightening-dashboard
timeout /t 2 /nobreak >nul
echo.
echo ========================================
echo   ✨ 3D动态效果清单
echo ========================================
echo.
echo 【背景效果】
echo   ✨ 50个粒子动态漂浮上升
echo   ⚡ 8条数据流光扫描效果
echo   🌟 渐变色光晕背景
echo.
echo 【工具栏效果】
echo   🔄 Logo 3D旋转动画
echo   ✨ 标题渐变流动效果
echo   💚 状态标签脉冲动画
echo   🌊 采集中波浪扫描
echo   🔘 3D按钮交互反馈
echo.
echo 【小工具卡片】
echo   🎭 翻转进入出现动画
echo   💎 悬停光效背景
echo   ⚡ 边框扫描线动画
echo   🎪 3D悬浮倾斜效果
echo   🌟 头部光束扫描
echo   🎯 操作按钮3D交互
echo.
echo 【选择器对话框】
echo   🎨 磨砂玻璃背景
echo   🃏 卡片3D翻转动画
echo   💫 图标旋转效果
echo   🌊 涟漪扩散动画
echo   💎 光晕跟随效果
echo.
echo ========================================
echo   🎮 交互体验指南
echo ========================================
echo.
echo 1. 观察背景粒子和流线动画
echo 2. 鼠标悬停小工具卡片查看3D效果
echo 3. 点击按钮体验3D按压反馈
echo 4. 点击"添加小工具"查看选择器3D卡片
echo 5. 滚动页面查看美化滚动条
echo.
echo 访问地址: http://localhost:3002/tightening-dashboard
echo.
echo ========================================
echo   🎉 3D效果全部完成！
echo ========================================
echo.
pause
