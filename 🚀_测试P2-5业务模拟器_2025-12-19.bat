@echo off
chcp 65001 >nul
title 测试P2-5业务模拟器 - 回款管理与AIPM

echo.
echo ====================================
echo   🚀 测试P2-5业务模拟器
echo   回款管理 + AIPM项目管理
echo ====================================
echo.
echo 📋 测试内容：
echo   1. 回款管理模块
echo   2. AIPM项目管理模块
echo   3. 多项目甘特图
echo   4. 3D项目可视化
echo   5. AI智能分析
echo.
echo 🌐 访问地址：http://localhost:3002/
echo.
echo 📝 测试步骤：
echo   第一步：测试回款管理
echo     - 销售目标 ^& 回款管理
echo     - 查看回款预警
echo     - 新建合同
echo     - 发送催收提醒
echo     - 查看催收记录
echo.
echo   第二步：测试AIPM项目管理
echo     - AIPM项目管理
echo     - 查看项目看板
echo     - 切换3D视图/列表视图
echo     - 查看甘特图
echo     - 展开项目详情（WBS任务树）
echo     - 查看AI建议
echo     - 采纳AI建议
echo.
echo ⏳ 正在启动开发服务器...
echo.

start http://localhost:3002/

cd /d "%~dp0"
npm run dev

pause
