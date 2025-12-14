@echo off
chcp 65001 >nul
echo ========================================
echo 重启服务器查看新智能体
echo ========================================
echo.

echo 📋 操作步骤:
echo.
echo 1️⃣ 提交代码 (如果还未提交)
echo    运行: 提交新智能体代码.bat
echo.
echo 2️⃣ 停止当前服务器
echo    在服务器终端按 Ctrl+C
echo.
echo 3️⃣ 重新启动服务器
echo    cd c:\Users\EricZ\CodeBuddy\AIWEB1
echo    npm run dev
echo.
echo 4️⃣ 等待服务器启动完成
echo    看到 "Local: http://localhost:3002/"
echo.
echo 5️⃣ 访问测试
echo    打开浏览器: http://localhost:3002/ai-agents
echo    硬刷新: Ctrl + Shift + R
echo.
echo ========================================
echo 🔍 检查新智能体
echo ========================================
echo.
echo 在AI智能体页面应该看到:
echo.
echo ┌────────────────────────────────┐
echo │ ⭐ 新功能                      │
echo │ ⚙️ 拧紧工艺改进与验证          │
echo │ 基于PSE拧紧程序的智能工艺...   │
echo │ ✓ PSE参数推荐                  │
echo │ ✓ 多策略分析                   │
echo │ ✓ 数据库管理                   │
echo │ 3种控制策略 丨 95%%推荐准确率   │
echo │ [立即使用 →]                   │
echo └────────────────────────────────┘
echo.
echo 位置: 第8个卡片 (在"产品技术销售小课堂"之后)
echo 特征: 带"新功能"标签，蓝色高亮背景
echo.
echo ========================================
echo.

choice /C 123 /N /M "请选择: [1]提交代码 [2]打开浏览器 [3]查看文档"

if errorlevel 3 goto docs
if errorlevel 2 goto browser
if errorlevel 1 goto commit

:commit
echo.
echo 🚀 正在提交代码...
call "提交新智能体代码.bat"
goto end

:browser
echo.
echo 🌐 正在打开浏览器...
start http://localhost:3002/ai-agents
echo.
echo ✅ 已在浏览器中打开
echo    如果看不到新智能体，请:
echo    1. 确认已提交代码
echo    2. 确认已重启服务器
echo    3. 硬刷新浏览器 (Ctrl+Shift+R)
goto end

:docs
echo.
echo 📚 正在打开文档...
start "智能体完整列表_2025-12-14.md"
goto end

:end
echo.
pause
