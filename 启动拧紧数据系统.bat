@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   启动 ToolsNet 8 拧紧数据采集系统
echo ========================================
echo.
echo 正在启动开发服务器...
echo.
cd /d "%~dp0"
start http://localhost:3002/tightening-dashboard
npm run dev
