@echo off
chcp 65001 >nul
color 0A
echo.
echo ========================================================
echo     🚀 测试AIMES卡片首页显示
echo ========================================================
echo.
echo 正在启动服务器并测试AIMES卡片...
echo.

echo [1/4] 📋 检查项目路径...
cd /d "%~dp0"
if exist "src\views\Home.vue" (
    echo ✅ 项目路径正确
) else (
    echo ❌ 项目路径错误！
    pause
    exit /b 1
)
echo.

echo [2/4] 🔍 验证AIMES卡片配置...
findstr /n "AIMES 智能制造" "src\views\Home.vue" >nul
if %errorlevel% equ 0 (
    echo ✅ AIMES卡片已配置
) else (
    echo ❌ 未找到AIMES卡片配置！
    pause
    exit /b 1
)
echo.

echo [3/4] 🛑 清理旧进程...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo ✅ 进程已清理
echo.

echo [4/4] 🚀 启动开发服务器...
echo.
echo 测试要点：
echo.
echo   1️⃣  首页向下滚动到"安彤智能体"板块
echo   2️⃣  查看第二排最后一个卡片
echo   3️⃣  确认显示"AIMES 智能制造"
echo   4️⃣  点击卡片验证跳转
echo.
echo ========================================================
echo.

start "AIWEB服务器" cmd /k "npm run dev"
timeout /t 8 /nobreak >nul

echo [启动浏览器]
start http://localhost:3002

timeout /t 3 /nobreak >nul

echo.
echo ========================================================
echo     ✅ 启动完成！
echo ========================================================
echo.
echo 📍 AIMES卡片位置：
echo.
echo   板块: 安彤智能体 / ANTOM AI Agents
echo   位置: 第2排第4个卡片
echo   特征: ⚙️ Setting图标 ^+ "新功能"标签
echo   邻居: 明升AICRM智能助手（左侧）
echo.
echo 🔍 验收清单：
echo   □ AIMES卡片在首页可见
echo   □ 卡片显示"AIMES 智能制造"
echo   □ 卡片有"新功能"红色标签
echo   □ 描述包含"AI MES系统"
echo   □ 点击后跳转到AIMES功能页
echo.
echo 📊 智能体板块布局（每行4个）：
echo.
echo   第1排: [监控驾驶舱] [设备管理] [曲线分析] [数据采集]
echo   第2排: [技术小课堂] [工艺改进] [明升AICRM] [AIMES] ← 新增
echo.
echo ========================================================
pause
