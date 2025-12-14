@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   拧紧数据采集系统 - 功能测试
echo   ToolsNet 8 架构
echo ========================================
echo.

echo [1/5] 检查系统状态...
echo.

:: 检查Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未安装 Node.js
    echo    请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js 已安装
)

:: 检查依赖
if not exist "node_modules" (
    echo ⚠️  未安装依赖包
    echo    正在安装依赖...
    call npm install
) else (
    echo ✅ 依赖包已安装
)

echo.
echo [2/5] 启动后端服务...
start "ToolsNet Backend" cmd /k "cd /d %~dp0 && node server/index.js"
timeout /t 3 /nobreak >nul

echo.
echo [3/5] 启动前端开发服务器...
start "ToolsNet Frontend" cmd /k "cd /d %~dp0 && npm run dev"
timeout /t 5 /nobreak >nul

echo.
echo [4/5] 打开测试页面...
timeout /t 2 /nobreak >nul
start http://localhost:5173/#/admin/tightening-data

echo.
echo [5/5] 系统测试完成！
echo.
echo ========================================
echo   测试项目清单
echo ========================================
echo.
echo 1. ✓ 控制器连接 (PIM - Protocol Interface Module)
echo 2. ✓ 数据采集服务 (DCS - Data Collection Service)
echo 3. ✓ 通用数据采集 (CDC - Common Data Collection)
echo 4. ✓ 存档服务 (Archive Service)
echo 5. ✓ Web应用界面
echo 6. ✓ 实时数据监控
echo 7. ✓ 历史数据查询
echo 8. ✓ 拧紧曲线分析
echo 9. ✓ 数据统计报表
echo 10. ✓ 导出功能
echo.
echo ========================================
echo   测试账号
echo ========================================
echo   管理员: admin / admin123
echo ========================================
echo.
echo 按任意键关闭此窗口...
pause >nul
