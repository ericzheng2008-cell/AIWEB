@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════
echo 🔍 监控与优化页面问题诊断
echo ═══════════════════════════════════════════════
echo.
echo 正在打开监控页面...
echo.

start http://localhost:3002/admin/monitoring-dashboard

timeout /t 3 /nobreak >nul

echo.
echo ═══════════════════════════════════════════════
echo 📋 请执行以下步骤:
echo ═══════════════════════════════════════════════
echo.
echo 1. 在打开的页面按 F12 打开开发者工具
echo.
echo 2. 切换到 Console 标签页
echo.
echo 3. 查看红色错误信息
echo.
echo 4. 复制错误信息并告诉我
echo.
echo ═══════════════════════════════════════════════
echo 💡 如果页面完全空白:
echo ═══════════════════════════════════════════════
echo.
echo 在控制台执行以下命令:
echo.
echo localStorage.clear();
echo sessionStorage.clear();
echo location.reload(true);
echo.
echo ═══════════════════════════════════════════════
echo.
pause
