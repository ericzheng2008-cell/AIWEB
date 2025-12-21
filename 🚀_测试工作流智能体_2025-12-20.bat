@echo off
chcp 65001 >nul
color 0A
echo.
echo ========================================
echo   🚀 AI工作流智能体测试脚本
echo ========================================
echo.
echo 📋 测试内容:
echo    1. 工作流编辑器V5_N8N (超大节点5倍版)
echo    2. AI智能辅助功能
echo    3. 6个AI Prompt套件
echo    4. 企业级功能演示
echo.
echo ========================================
echo   启动开发服务器...
echo ========================================
echo.

cd /d "%~dp0"

:: 检查 Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未检测到 Node.js
    echo    请先安装 Node.js: https://nodejs.org
    pause
    exit /b 1
)

:: 检查依赖
if not exist "node_modules" (
    echo 📦 首次运行，正在安装依赖...
    call npm install
    if errorlevel 1 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
)

:: 启动服务器
echo.
echo ✅ 正在启动服务器...
echo.
start cmd /k "title 工作流智能体开发服务器 && npm run dev"

:: 等待服务器启动
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   🎉 服务器启动成功！
echo ========================================
echo.
echo 📍 访问地址:
echo.
echo    工作流编辑器V5 (超大节点):
echo    👉 http://localhost:5173/workflow-editor-v5-n8n
echo.
echo    其他页面:
echo    - 主页: http://localhost:5173/
echo    - 工作流Agent V3: http://localhost:5173/workflow-agent-v3
echo    - 工作流编辑器V4: http://localhost:5173/workflow-editor-v4
echo.
echo ========================================
echo   🧪 测试要点
echo ========================================
echo.
echo ✅ 1. 超大节点显示
echo    - 节点宽度 1200px (5倍放大)
echo    - 图标 180px x 180px
echo    - 文字 60-70px
echo    - 网格 100px间距
echo    - 连接线 10px粗细
echo.
echo ✅ 2. AI智能功能
echo    - 点击顶部 "AI助手" 按钮
echo    - 测试 "智能生成" Tab
echo    - 输入场景描述
echo    - 查看AI生成的工作流
echo.
echo ✅ 3. 节点操作
echo    - 从左侧节点库拖拽节点
echo    - 双击节点编辑属性
echo    - 查看9个属性标签
echo    - 测试节点连接
echo.
echo ✅ 4. 工作流模板
echo    - 左侧节点库底部
echo    - 4个企业级模板
echo    - 点击加载模板
echo.
echo ✅ 5. 调试功能
echo    - 点击顶部 "调试" 按钮
echo    - 查看节点执行状态
echo    - 查看输入输出数据
echo.
echo ========================================
echo   📚 完整文档
echo ========================================
echo.
echo 📄 设计方案:
echo    🎊_工作流编辑体验深度优化完成_2025-12-20.md
echo.
echo 📄 AI Prompt指南:
echo    📋_工作流智能体Master_Prompt开发指南_2025-12-20.md
echo.
echo 📄 开发完成报告:
echo    🎊_AI工作流智能体Master_Prompt开发完成_2025-12-20.md
echo.
echo ========================================
echo.
echo 💡 提示: 浏览器将自动打开，如未打开请手动访问上述地址
echo.
pause

:: 打开浏览器
start http://localhost:5173/workflow-editor-v5-n8n
