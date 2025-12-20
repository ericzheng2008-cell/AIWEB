@echo off
chcp 65001 >nul
color 0D
echo.
echo ========================================================
echo     🔧 AIMES卡片显示问题 - 快速修复
echo ========================================================
echo.
echo 正在执行诊断和修复流程...
echo.

echo [1/5] 📋 检查项目路径...
cd /d "%~dp0"
if exist "src\views\MingShengAICRM_V3.vue" (
    echo ✅ 项目路径正确
) else (
    echo ❌ 项目路径错误！
    pause
    exit /b 1
)
echo.

echo [2/5] 🔍 验证AIMES数据配置...
findstr /n "AIMES 智能制造助手" "src\views\MingShengAICRM_V3.vue" >nul
if %errorlevel% equ 0 (
    echo ✅ AIMES数据配置存在
) else (
    echo ❌ 未找到AIMES数据配置！
    pause
    exit /b 1
)
echo.

echo [3/5] 🛑 停止现有服务器...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo ✅ 已清理进程
echo.

echo [4/5] 🚀 启动开发服务器...
echo.
echo 提示: 服务器启动后，请执行以下操作：
echo.
echo   1️⃣  等待浏览器自动打开
echo   2️⃣  点击顶部导航栏的 "AI智能体" 标签
echo   3️⃣  向下滚动页面到第二行
echo   4️⃣  查找紫色卡片（AIMES 智能制造助手）
echo.
echo ========================================================
echo.

start "AIWEB服务器" cmd /k "npm run dev"
timeout /t 8 /nobreak >nul

echo [5/5] 🌐 打开浏览器...
start http://localhost:3002

timeout /t 3 /nobreak >nul

echo.
echo ========================================================
echo     ✅ 启动完成！
echo ========================================================
echo.
echo 📍 AIMES卡片位置提示：
echo.
echo   位置: AI智能体标签页 ^> 第2行第1个卡片
echo   特征: 紫色 ^• Setting图标 ^• 准确率93%%
echo   操作: 向下滚动查看第二行
echo.
echo 🔍 如果仍然看不到，请：
echo   1. 确认点击的是"AI智能体"标签（不是"明升AICRM V3.0"）
echo   2. 浏览器窗口最大化（按F11全屏）
echo   3. 向下滚动页面
echo   4. 清除缓存后刷新（Ctrl+Shift+Delete，然后Ctrl+F5）
echo.
echo 📖 需要详细诊断？运行: 🔍_诊断AIMES卡片显示问题_2025-12-20.html
echo.
echo ========================================================
pause
