@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════
echo 🚀 监控页面标签切换修复测试
echo ═══════════════════════════════════════════════
echo.
echo ✅ 已完成修复:
echo    - 修改了 benchmarks 初始值
echo    - responseTime: 0 → 1500ms
echo    - errorRate: 0 → 0.02
echo    - availability: 1.0 → 0.98
echo    - userSatisfaction: 0 → 4.2星
echo    - knowledgeQuality: 0 → 75分
echo.
echo ═══════════════════════════════════════════════
echo.

echo 正在打开监控页面...
start http://localhost:3002/admin/monitoring-dashboard

timeout /t 3 /nobreak >nul

echo.
echo ═══════════════════════════════════════════════
echo 📋 请执行以下测试步骤:
echo ═══════════════════════════════════════════════
echo.
echo 1. 页面打开后,按 Ctrl + Shift + R 硬刷新
echo.
echo 2. 依次点击四个标签页:
echo    □ 性能监控
echo    □ 告警管理
echo    □ 优化建议
echo    □ 系统配置
echo.
echo 3. 检查每个标签页的内容是否正常显示
echo.
echo 4. 按 F12 查看控制台,确保无错误
echo.
echo ═══════════════════════════════════════════════
echo 💡 如果标签页仍然点击不动:
echo ═══════════════════════════════════════════════
echo.
echo 在控制台执行:
echo   localStorage.clear();
echo   sessionStorage.clear();
echo   location.reload(true);
echo.
echo ═══════════════════════════════════════════════
echo.
pause
