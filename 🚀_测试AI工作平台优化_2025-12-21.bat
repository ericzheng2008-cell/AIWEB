@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🚀 测试AI工作平台优化
echo   Testing AI Work Platforms Optimization
echo ========================================
echo.
echo 📋 测试内容:
echo   1. 板块名称: AI工作平台 (原AI工作流平台)
echo   2. 平台总数: 30个 (原29个)
echo   3. 新增平台: AI工具集 (https://ai-bot.cn/)
echo.
echo 🔧 启动开发服务器...
echo.

cd /d "%~dp0"

:: 检查 node_modules 是否存在
if not exist "node_modules" (
    echo ❌ 未找到 node_modules 文件夹
    echo 📦 正在安装依赖...
    call npm install
    if errorlevel 1 (
        echo.
        echo ❌ 依赖安装失败！
        pause
        exit /b 1
    )
)

:: 启动开发服务器
echo.
echo ✅ 正在启动开发服务器...
start cmd /k "npm run dev"

:: 等待服务器启动
timeout /t 5 /nobreak >nul

:: 打开浏览器
echo.
echo 🌐 正在打开浏览器...
start http://localhost:3002

echo.
echo ========================================
echo   ✅ 服务器已启动！
echo ========================================
echo.
echo 📖 验证步骤:
echo   1. 滚动到 "AI工作平台" 板块
echo   2. 确认标题为 "🤖 AI工作平台 / AI Work Platforms"
echo   3. 确认卡片显示 "30个顶尖平台"
echo   4. 点击卡片打开弹窗
echo   5. 确认弹窗标题 "🤖 AI工作平台集（30个）"
echo   6. 确认第一个平台是 "AI工具集" 🛠️
echo   7. 点击 "AI工具集" 测试跳转到 https://ai-bot.cn/
echo.
echo 🎯 所有功能应该正常运行！
echo.
pause
