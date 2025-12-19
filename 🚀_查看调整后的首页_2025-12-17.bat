@echo off
chcp 65001 >nul
color 0A
title 查看调整后的首页

echo.
echo ========================================
echo   🚀 工具选型和工单系统已移至产品服务
echo ========================================
echo.
echo 调整内容：
echo ✅ 拧紧工具选型 → 从智能体移至产品服务
echo ✅ 故障工单管理 → 从智能体移至产品服务
echo ✅ 智能体数量：8个 → 6个
echo ✅ 后台管理：保持不变
echo.
echo ========================================
echo.
echo 正在启动开发服务器...
echo.

cd /d "%~dp0"

rem 检查是否已经有服务器在运行
netstat -ano | findstr ":5173" >nul
if %errorlevel%==0 (
    echo ✅ 服务器已在运行中
    echo.
    echo 请访问：http://localhost:5173
    echo.
    echo 查看内容：
    echo 1. 首页 → 产品和服务板块（新增工具选型和工单管理）
    echo 2. 首页 → 智能体板块（现在只有6个）
    echo 3. AI智能体页面（也是6个）
    echo.
    timeout /t 3 >nul
    start http://localhost:5173
) else (
    echo 正在启动服务器...
    start cmd /k "npm run dev"
    echo.
    echo ⏳ 等待服务器启动（约10秒）...
    timeout /t 10 >nul
    start http://localhost:5173
)

echo.
echo ========================================
echo   测试要点
echo ========================================
echo.
echo 1. 查看"产品和服务"板块
echo    → 应该能看到"拧紧工具选型"和"故障工单管理"
echo.
echo 2. 点击这两个卡片
echo    → 应该能正确跳转到对应功能页面
echo.
echo 3. 查看"智能体"板块
echo    → 应该只显示6个卡片（不包含工具选型和工单管理）
echo.
echo 4. 访问 AI智能体页面
echo    → 也应该只显示6个卡片
echo.
echo 5. 后台管理
echo    → 所有功能保持不变
echo.
echo ========================================
echo.
pause
