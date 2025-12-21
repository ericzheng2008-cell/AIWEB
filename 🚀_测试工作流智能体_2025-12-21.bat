@echo off
chcp 65001 > nul
title 工作流智能体快速测试
color 0A

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║           🚀 工作流智能体快速测试                              ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 正在启动开发服务器...
echo.

cd /d "%~dp0"

echo [1/3] 检查Node.js环境...
node -v > nul 2>&1
if errorlevel 1 (
    echo ❌ 未检测到Node.js，请先安装Node.js
    pause
    exit /b 1
)
echo ✅ Node.js环境正常

echo.
echo [2/3] 启动前端服务器 (端口3000)...
start "AIWEB前端服务器" cmd /k "npm run dev"

timeout /t 5 /nobreak > nul

echo.
echo [3/3] 打开工作流智能体测试页面...
echo.
echo ════════════════════════════════════════════════════════════════
echo   将打开4个版本供您测试：
echo ════════════════════════════════════════════════════════════════
echo.
echo   1. v2.7 基础版
echo   2. v3.0 企业版  
echo   3. v4.0 专业版
echo   4. v7.0 旗舰版 ⭐ (推荐)
echo.
echo ════════════════════════════════════════════════════════════════

timeout /t 3 /nobreak > nul

echo.
echo 打开浏览器中...

:: 打开推荐版本 (v7.0)
start http://localhost:3000/workflow-editor-v5-n8n

timeout /t 2 /nobreak > nul

echo.
echo ════════════════════════════════════════════════════════════════
echo  ✅ 测试页面已打开！
echo ════════════════════════════════════════════════════════════════
echo.
echo  📌 测试步骤：
echo  1. 从左侧拖拽节点到画布
echo  2. 连接节点创建流程
echo  3. 点击节点编辑属性
echo  4. 点击"AI生成工作流"测试AI功能
echo.
echo  🌟 其他版本访问地址：
echo     v2.7: http://localhost:3000/workflow-agent
echo     v3.0: http://localhost:3000/workflow-agent-v3
echo     v4.0: http://localhost:3000/workflow-editor-v4
echo.
echo  ⚠️  如遇问题，请按F12打开浏览器控制台查看错误
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo 按任意键打开其他版本进行对比测试...
pause > nul

:: 打开其他版本
start http://localhost:3000/workflow-agent
timeout /t 1 /nobreak > nul
start http://localhost:3000/workflow-agent-v3
timeout /t 1 /nobreak > nul
start http://localhost:3000/workflow-editor-v4

echo.
echo ✅ 所有版本已打开，请在浏览器中测试！
echo.
echo 测试完成后请关闭本窗口。
echo.
pause
