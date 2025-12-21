@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🔍 工作流编辑器诊断工具
echo ========================================
echo.
echo 📋 诊断步骤：
echo.
echo 1️⃣  打开诊断指南页面
echo 2️⃣  访问工作流编辑器
echo 3️⃣  按F12打开控制台
echo 4️⃣  运行诊断脚本
echo 5️⃣  截图发送错误信息
echo.
echo ========================================
echo.

echo 🚀 正在打开诊断指南...
start "" "🔍_诊断工作流编辑器问题_2025-12-20.html"

timeout /t 2 >nul

echo.
echo 🌐 正在打开工作流编辑器...
start "" "http://localhost:5173/#/workflow-editor-v5-n8n"

echo.
echo ========================================
echo   ✅ 诊断页面已打开
echo ========================================
echo.
echo 📝 请按照诊断指南操作：
echo    1. 检查页面显示是否正常
echo    2. 测试各项功能
echo    3. 复制控制台错误
echo    4. 反馈具体问题
echo.
echo 💡 提示：按 F12 打开浏览器控制台
echo.
pause
