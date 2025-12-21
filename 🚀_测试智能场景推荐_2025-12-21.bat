@echo off
chcp 65001 >nul
echo ========================================
echo   🤖 测试智能场景推荐系统
echo ========================================
echo.
echo 📋 测试步骤：
echo.
echo 1️⃣  打开AI应答机器人（右下角）
echo.
echo 2️⃣  输入以下测试问题，查看智能推荐：
echo.
echo    设备管理场景：
echo    ├─ "我需要管理设备"
echo    ├─ "设备维护怎么做"
echo    └─ "资产管理系统"
echo.
echo    招聘场景：
echo    ├─ "我要招人"
echo    ├─ "HR系统推荐"
echo    └─ "招聘流程管理"
echo.
echo    销售分析场景：
echo    ├─ "销售数据分析"
echo    ├─ "客户管理系统"
echo    └─ "业绩目标追踪"
echo.
echo    项目管理场景：
echo    ├─ "项目管理工具"
echo    ├─ "甘特图功能"
echo    └─ "任务协作"
echo.
echo    AI开发场景：
echo    ├─ "AI智能体开发"
echo    ├─ "机器人助手"
echo    └─ "智能客服"
echo.
echo    学习培训场景：
echo    ├─ "产品培训"
echo    ├─ "技术课程"
echo    └─ "知识学习"
echo.
echo 3️⃣  检查推荐结果：
echo    ✓ 内部工具（明升智能体）
echo    ✓ 外部AI平台推荐
echo    ✓ 可点击的建议卡片
echo.
echo 4️⃣  点击建议卡片测试跳转：
echo    ✓ 内部工具：直接打开功能页面
echo    ✓ 外部工具：新标签页打开链接
echo.
echo ========================================
echo   正在启动开发服务器...
echo ========================================
echo.

cd /d "%~dp0"
start http://localhost:3002
npm run dev

pause
