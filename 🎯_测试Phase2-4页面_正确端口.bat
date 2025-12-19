@echo off
chcp 65001 >nul
cls

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║        🎯 测试 Phase 2-4 页面（正确端口）             ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo ⚠️ 重要提示：当前服务器运行在端口 3002，不是 5173
echo.
echo ══════════════════════════════════════════════════════════
echo.

echo 📝 正在打开测试页面...
echo.

timeout /t 2 /nobreak >nul

echo 1️⃣ 打开智能体注册中心...
start http://localhost:3002/admin/agent-registry
timeout /t 1 /nobreak >nul

echo.
echo 2️⃣ 打开知识库管理...
start http://localhost:3002/admin/knowledge
timeout /t 1 /nobreak >nul

echo.
echo 3️⃣ 打开主动学习引擎...
start http://localhost:3002/admin/learning
timeout /t 1 /nobreak >nul

echo.
echo 4️⃣ 打开监控与优化...
start http://localhost:3002/admin/monitoring

echo.
echo ══════════════════════════════════════════════════════════
echo.
echo ✅ 所有页面已在浏览器中打开！
echo.
echo 📋 测试清单：
echo.
echo   [ ] 智能体注册中心 - 应该显示智能体列表
echo   [ ] 知识库管理 - 应该显示统计卡片和知识列表
echo   [ ] 主动学习引擎 - 应该显示反馈数据和学习任务
echo   [ ] 监控与优化 - 应该显示系统健康度和性能数据
echo.
echo ══════════════════════════════════════════════════════════
echo.
echo 🔍 如果页面仍然空白：
echo.
echo 1. 按 F12 打开浏览器控制台
echo 2. 执行以下代码清除缓存：
echo.
echo    localStorage.clear();
echo    sessionStorage.clear();
echo    location.reload(true);
echo.
echo 3. 然后刷新页面查看
echo.
echo ══════════════════════════════════════════════════════════
echo.

pause
