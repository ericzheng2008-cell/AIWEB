@echo off
chcp 65001 >nul
echo ========================================
echo    开发服务器已启动
echo ========================================
echo.
echo 服务器地址: http://localhost:3002
echo.
echo ========================================
echo    正在打开中央管理平台...
echo ========================================
echo.

timeout /t 2 /nobreak >nul

echo [1/5] 打开后台首页...
start http://localhost:3002/admin
timeout /t 2 /nobreak >nul

echo [2/5] 打开智能体注册中心...
start http://localhost:3002/admin/agent-registry
timeout /t 2 /nobreak >nul

echo [3/5] 打开知识库管理...
start http://localhost:3002/admin/knowledge-base
timeout /t 2 /nobreak >nul

echo [4/5] 打开主动学习引擎...
start http://localhost:3002/admin/learning-engine
timeout /t 2 /nobreak >nul

echo [5/5] 打开监控与优化...
start http://localhost:3002/admin/monitoring-dashboard

echo.
echo ✅ 所有页面已打开！
echo.
echo ========================================
echo    重要提示
echo ========================================
echo.
echo 1. 如果页面空白，按 Ctrl+Shift+R 硬刷新
echo 2. 如果看到错误，按 F12 查看控制台
echo 3. 服务器运行在端口 3002
echo.
pause
