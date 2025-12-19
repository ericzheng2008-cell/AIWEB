@echo off
chcp 65001 >nul
echo ========================================
echo    中央管理平台 - 快速访问
echo ========================================
echo.
echo 正在打开所有管理页面...
echo.

echo [1/4] 打开智能体注册中心...
start http://localhost:3002/admin/agent-registry
timeout /t 3 /nobreak >nul

echo [2/4] 打开知识库管理系统...
start http://localhost:3002/admin/knowledge-base
timeout /t 3 /nobreak >nul

echo [3/4] 打开主动学习引擎...
start http://localhost:3002/admin/learning-engine
timeout /t 3 /nobreak >nul

echo [4/4] 打开监控与优化系统...
start http://localhost:3002/admin/monitoring-dashboard
timeout /t 2 /nobreak >nul

echo.
echo ✅ 所有页面已在浏览器中打开！
echo.
echo ========================================
echo    检查要点
echo ========================================
echo.
echo 请在浏览器中检查以下内容：
echo.
echo ✓ 页面是否正常显示（无空白）
echo ✓ 统计卡片是否显示数据
echo ✓ 表格是否有演示数据
echo ✓ 按钮是否可以点击
echo ✓ 对话框是否可以打开
echo ✓ 表单是否可以编辑和保存
echo ✓ 数据是否持久化（刷新后仍存在）
echo.
echo 如有问题，请告知具体错误信息。
echo.
pause
