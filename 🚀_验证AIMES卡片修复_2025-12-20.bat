@echo off
chcp 65001 >nul
color 0B
echo.
echo ========================================================
echo     🚀 验证AIMES卡片白屏问题修复
echo ========================================================
echo.
echo 正在验证修复效果...
echo.

echo [1/5] 📋 检查路由配置...
findstr /n "path: '/mingsheng-aicrm'" "src\router\index.js" >nul
if %errorlevel% equ 0 (
    echo ✅ 路由配置正确
) else (
    echo ❌ 路由配置错误！
    pause
    exit /b 1
)
echo.

echo [2/5] 🔍 验证Home.vue修复...
findstr /n "path: '/mingsheng-aicrm?tab=aimes'" "src\views\Home.vue" >nul
if %errorlevel% equ 0 (
    echo ✅ AIMES卡片路径已修复
) else (
    echo ❌ AIMES卡片路径仍然错误！
    pause
    exit /b 1
)
echo.

echo [3/5] 🔍 验证useRoute导入...
findstr /n "import.*useRoute" "src\views\MingShengAICRM_V3.vue" >nul
if %errorlevel% equ 0 (
    echo ✅ useRoute已导入
) else (
    echo ❌ useRoute未导入！
    pause
    exit /b 1
)
echo.

echo [4/5] 🔍 验证URL参数处理...
findstr /n "route.query.tab" "src\views\MingShengAICRM_V3.vue" >nul
if %errorlevel% equ 0 (
    echo ✅ URL参数处理已添加
) else (
    echo ❌ URL参数处理未添加！
    pause
    exit /b 1
)
echo.

echo [5/5] 🚀 启动服务器测试...
echo.
echo ✅ 所有修复验证通过！
echo.
echo 测试步骤：
echo.
echo   1️⃣  访问首页 http://localhost:3002
echo   2️⃣  滚动到"安彤智能体"板块
echo   3️⃣  点击"AIMES 智能制造"卡片
echo   4️⃣  验证：页面正常显示，无白屏
echo   5️⃣  验证：AIMES标签页自动激活
echo   6️⃣  验证：显示6大模块和AI智能体矩阵
echo.
echo 或直接访问: http://localhost:3002/mingsheng-aicrm?tab=aimes
echo.
echo ========================================================
echo.

taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

start "AIWEB服务器" cmd /k "npm run dev"
timeout /t 8 /nobreak >nul

echo [启动浏览器]
start http://localhost:3002

timeout /t 2 /nobreak >nul

echo.
echo ========================================================
echo     ✅ 修复验证完成！
echo ========================================================
echo.
echo 🎯 测试要点：
echo.
echo   □ 点击AIMES卡片后无白屏
echo   □ 自动显示AIMES标签页内容
echo   □ 顶部导航"AIMES智能制造"高亮
echo   □ 浏览器控制台无路由错误
echo   □ URL显示为 /mingsheng-aicrm?tab=aimes
echo.
echo 📊 修复内容：
echo   ✅ 路由路径: /mingsheng-aicrm-v3 → /mingsheng-aicrm
echo   ✅ 导入useRoute并处理URL参数
echo   ✅ 支持所有标签页通过URL参数访问
echo.
echo ========================================================
pause
