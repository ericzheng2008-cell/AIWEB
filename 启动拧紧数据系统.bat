@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   拧紧数据采集系统 - ToolsNet 8
echo   版本: v3.0.0
echo ========================================
echo.

REM 检查Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org
    pause
    exit /b 1
)

echo [✓] Node.js 已安装
node --version

REM 检查SQL Server
echo.
echo [检查] SQL Server 状态...
sqlcmd -S localhost -E -Q "SELECT @@VERSION" >nul 2>&1
if %errorlevel% neq 0 (
    echo [警告] SQL Server 未连接，将使用本地存储模式
    echo.
) else (
    echo [✓] SQL Server 已连接
)

REM 检查数据库
echo.
echo [检查] ToolsNet8 数据库...
sqlcmd -S localhost -E -Q "USE ToolsNet8; SELECT 'OK'" >nul 2>&1
if %errorlevel% neq 0 (
    echo [提示] 数据库未创建，是否立即创建？(Y/N)
    choice /C YN /N
    if errorlevel 2 goto :skip_db
    if errorlevel 1 (
        echo.
        echo [执行] 创建数据库...
        sqlcmd -S localhost -E -i server\models\create_database.sql
        if %errorlevel% equ 0 (
            echo [✓] 数据库创建成功
        ) else (
            echo [错误] 数据库创建失败
            pause
            exit /b 1
        )
    )
) else (
    echo [✓] 数据库已存在
)
:skip_db

REM 检查依赖
echo.
echo [检查] 项目依赖...
if not exist "node_modules" (
    echo [安装] 前端依赖...
    call npm install
)
if not exist "server\node_modules" (
    echo [安装] 后端依赖...
    cd server
    call npm install
    cd ..
)
echo [✓] 依赖已安装

REM 启动后端
echo.
echo [启动] 后端服务...
start "拧紧数据系统-后端" cmd /k "cd server && npm start"
timeout /t 3 /nobreak >nul

REM 启动前端
echo.
echo [启动] 前端服务...
start "拧紧数据系统-前端" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul

REM 打开浏览器
echo.
echo [打开] 浏览器...
timeout /t 3 /nobreak >nul
start http://localhost:5173/admin/tightening-data

echo.
echo ========================================
echo   系统启动完成！
echo ========================================
echo.
echo   后端服务: http://localhost:5000
echo   前端界面: http://localhost:5173
echo   系统页面: http://localhost:5173/admin/tightening-data
echo.
echo   按任意键查看使用说明...
pause >nul

echo.
echo ========================================
echo   快速使用指南
echo ========================================
echo.
echo 1. 生成模拟数据测试
echo    - 点击 "生成模拟数据" 按钮
echo    - 系统将生成100条测试数据
echo.
echo 2. 连接真实控制器
echo    - 控制器类型: PF4000/PF6000/PF8000/PowerMACS
echo    - IP地址: 例如 192.168.1.100
echo    - 端口: 4545 (Open Protocol标准)
echo    - 点击 "连接控制器 (PIM)"
echo.
echo 3. 启动数据采集
echo    - 连接成功后点击 "启动数据采集服务 (DCS)"
echo    - 观察实时数据流
echo.
echo 4. 数据分析
echo    - 切换到 "数据分析" 标签
echo    - 查看OK率趋势、扭矩分布
echo    - 查看Cpk过程能力分析
echo.
echo 5. 导出数据
echo    - 点击 "导出数据" 按钮
echo    - 生成CSV报告
echo.
echo ========================================
echo   故障排查
echo ========================================
echo.
echo 问题1: 端口被占用
echo   解决: 运行 "清理端口并启动.bat"
echo.
echo 问题2: 数据库连接失败
echo   解决: 检查SQL Server服务是否运行
echo   命令: services.msc 查找 SQL Server
echo.
echo 问题3: 白屏或加载失败
echo   解决: 清除浏览器缓存 (Ctrl+Shift+Delete)
echo.
echo ========================================
echo   技术支持文档
echo ========================================
echo.
echo   • 功能文档_拧紧数据采集系统_ToolsNet8架构_v3.0.0.md
echo   • 快速部署指南_拧紧数据采集系统_2025-12-14.md
echo   • ✅_拧紧数据采集系统_ToolsNet8完整实现_2025-12-14.md
echo.
echo ========================================
echo.
echo 按任意键退出...
pause >nul
