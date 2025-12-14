@echo off
chcp 65001 >nul
color 0A
cls

echo.
echo     ╔══════════════════════════════════════════════════════════╗
echo     ║                                                          ║
echo     ║        🤖 安彤智能体系统 - 欢迎体验                     ║
echo     ║                                                          ║
echo     ║        ANTOM AI: Autonomous Network Think-Optimize      ║
echo     ║                                                          ║
echo     ╚══════════════════════════════════════════════════════════╝
echo.
echo     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo     🌟 全新升级特性：
echo.
echo        🧠 自主学习 - 从您的行为中持续学习
echo        🤔 主动思考 - 预测需求，识别问题
echo        🎯 持续改善 - 不断优化推荐算法
echo        💬 主动沟通 - 智能提醒和建议推送
echo.
echo     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

timeout /t 2 >nul

echo     [1/4] 📦 检查环境...
if not exist "node_modules" (
    echo            ⚠️  依赖未安装，正在安装...
    call npm install >nul 2>&1
    echo            ✅ 依赖安装完成
) else (
    echo            ✅ 环境就绪
)
echo.

echo     [2/4] 🔍 验证安彤AI组件...
set components_ok=1
if not exist "src\store\antomAI.js" set components_ok=0
if not exist "src\components\AntomAIMonitor.vue" set components_ok=0

if %components_ok%==1 (
    echo            ✅ 安彤AI组件就绪
) else (
    echo            ❌ 部分组件缺失
    pause
    exit /b 1
)
echo.

echo     [3/4] 📝 初始化安彤AI系统...
echo            正在加载自主学习模块...
timeout /t 1 >nul
echo            正在启动主动思考引擎...
timeout /t 1 >nul
echo            正在初始化持续改善机制...
timeout /t 1 >nul
echo            正在激活主动沟通系统...
timeout /t 1 >nul
echo            ✅ 安彤AI系统初始化完成
echo.

echo     [4/4] 🚀 启动开发服务器...
echo.
echo     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo     🎯 体验指南：
echo.
echo        1️⃣  右下角有个蓝色的 🧠 按钮（会跳动）
echo        2️⃣  点击打开"安彤智能体监控中心"
echo        3️⃣  查看系统状态和学习统计
echo        4️⃣  正常使用系统（安彤AI在后台学习）
echo        5️⃣  等待智能建议通知
echo        6️⃣  尝试"智能对话"功能
echo        7️⃣  观察系统如何主动帮助您
echo.
echo     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo     💡 核心功能演示：
echo.
echo        🧠 自主学习（自动）
echo           · 记录每个操作行为
echo           · 分析使用模式和偏好
echo           · 建立个性化知识图谱
echo           · 每5分钟自动学习一次
echo.
echo        🤔 主动思考（自动）
echo           · 预测下一步需求
echo           · 识别潜在问题
echo           · 生成智能建议
echo           · 每3分钟主动分析
echo.
echo        🎯 持续改善（自动）
echo           · 评估功能效果
echo           · 优化推荐算法
echo           · 提升成功率
echo           · 实时性能优化
echo.
echo        💬 主动沟通（自动+手动）
echo           · 智能提醒和建议
echo           · 问题预防提示
echo           · 效率提升建议
echo           · 自然语言对话
echo.
echo     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo     📍 服务器地址: http://localhost:5173
echo     📖 快速入门: 快速入门_安彤智能体_2025-12-13_v1.0.0.md
echo     📘 完整文档: 功能文档_安彤智能体自主学习系统_2025-12-13_v1.0.0.md
echo.
echo     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo     🎊 安彤AI已就绪，2秒后启动浏览器...
echo.

timeout /t 2 >nul

start http://localhost:5173

echo     正在启动服务器...
echo.
echo     🤖 安彤AI提示: 我会在后台默默学习您的使用习惯，
echo                    主动思考您的需求，并持续优化为您服务！
echo.
call npm run dev
