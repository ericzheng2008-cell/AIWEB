@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🚀 AI国际营销中台 - 快速体验
echo ========================================
echo.
echo 正在启动系统...
echo.

REM 检查服务器是否运行
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 服务器已运行
) else (
    echo ⚠️  服务器未运行，正在启动...
    start "AIWEB 开发服务器" cmd /k "npm run dev"
    echo 等待服务器启动（10秒）...
    timeout /t 10 /nobreak >nul
)

echo.
echo ========================================
echo   📋 功能导航
echo ========================================
echo.
echo Phase 2：AI驱动营销
echo   1. AI产品选型系统
echo   2. 资源中心
echo.
echo Phase 3：营销自动化
echo   3. AI邮件营销系统
echo   4. 线索孵化系统
echo.
echo Phase 4：数据分析
echo   5. 营销数据中台
echo.
echo 其他
echo   6. 打开完整使用指南
echo   0. 退出
echo.
echo ========================================

set /p choice="请选择功能（输入数字）："

if "%choice%"=="1" (
    echo.
    echo 🎯 正在打开 AI产品选型系统...
    start http://localhost:5173/ai-product-selector
)

if "%choice%"=="2" (
    echo.
    echo 📚 正在打开 资源中心...
    start http://localhost:5173/resource-center
)

if "%choice%"=="3" (
    echo.
    echo 📧 正在打开 AI邮件营销系统...
    start http://localhost:5173/email-marketing
)

if "%choice%"=="4" (
    echo.
    echo 🔄 正在打开 线索孵化系统...
    start http://localhost:5173/lead-nurturing
)

if "%choice%"=="5" (
    echo.
    echo 📊 正在打开 营销数据中台...
    start http://localhost:5173/marketing-data-hub
)

if "%choice%"=="6" (
    echo.
    echo 📖 正在打开 完整使用指南...
    start notepad "📖_AI国际营销中台完整使用指南_2025-12-17.md"
)

if "%choice%"=="0" (
    echo.
    echo 👋 再见！
    timeout /t 2 /nobreak >nul
    exit
)

echo.
echo ========================================
echo   ✅ 完成
echo ========================================
echo.
echo 💡 提示：
echo   - 使用 Ctrl+点击 浏览器中的链接
echo   - 切换语言测试多语言功能
echo   - 查看完整使用指南了解详细功能
echo.
pause
