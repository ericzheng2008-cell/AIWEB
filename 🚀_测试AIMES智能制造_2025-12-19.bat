@echo off
chcp 65001 >nul
title 测试AIMES智能制造系统 - 2025-12-19

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║         🏭 AIMES 智能制造执行系统 - 功能测试                  ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo ✨ 已完成功能:
echo    1. ✅ 六大核心模块卡片
echo    2. ✅ 实时生产监控大屏
echo    3. ✅ AI智能体助手矩阵
echo    4. ✅ 设备健康监控
echo    5. ✅ 质量趋势分析
echo    6. ✅ 异常预警时间轴
echo.
echo 📋 测试要点:
echo    - 点击模块卡片查看详情
echo    - 查看产线实时状态(OEE/进度)
echo    - 启动AI智能体助手
echo    - 检查设备健康指数
echo    - 查看质量合格率趋势
echo    - 处理异常预警
echo.
echo 🎯 访问路径:
echo    明升AICRM → 顶部导航栏 → AIMES智能制造
echo.
echo 🚀 正在启动开发服务器...
echo.

start http://localhost:5173/mingsheng-aicrm-v3

cd /d "%~dp0"
npm run dev

pause
