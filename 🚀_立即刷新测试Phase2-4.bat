@echo off
chcp 65001 >nul
echo ========================================
echo    Phase 2-4 页面空白问题已修复
echo ========================================
echo.
echo 修复内容:
echo  ✅ 修复了 monitoringSystem.js 的导入错误
echo  ✅ 修复了 6 处使用错误的 store 调用
echo.
echo ========================================
echo    正在打开测试页面...
echo ========================================
echo.

timeout /t 2 /nobreak >nul

echo [1/3] 打开知识库管理...
start http://localhost:3002/admin/knowledge-base
timeout /t 3 /nobreak >nul

echo [2/3] 打开主动学习引擎...
start http://localhost:3002/admin/learning-engine
timeout /t 3 /nobreak >nul

echo [3/3] 打开监控与优化...
start http://localhost:3002/admin/monitoring-dashboard

echo.
echo ========================================
echo    重要提示
echo ========================================
echo.
echo ⚠️ 请在每个页面执行以下操作:
echo.
echo 1. 按 F12 打开开发者工具
echo 2. 在 Console 中执行以下代码:
echo.
echo    localStorage.clear();
echo    sessionStorage.clear();
echo    location.reload(true);
echo.
echo 或直接按 Ctrl+Shift+R 硬刷新
echo.
echo ========================================
echo    检查清单
echo ========================================
echo.
echo ✓ 页面是否正常显示（不空白）
echo ✓ 统计卡片是否有数据
echo ✓ 按钮是否可以点击
echo ✓ 对话框是否可以打开
echo ✓ 浏览器控制台无错误
echo.
pause
