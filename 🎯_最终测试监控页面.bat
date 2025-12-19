@echo off
chcp 65001 >nul
cls
echo.
echo ═══════════════════════════════════════════════════════════
echo   🎯 监控与优化页面 - 最终修复测试
echo ═══════════════════════════════════════════════════════════
echo.
echo ✅ 已完成的修复:
echo.
echo   【第1轮】修改 benchmarks 初始值
echo     - responseTime: 0 → 1500ms
echo     - errorRate: 0 → 0.02
echo     - userSatisfaction: 0 → 4.2星
echo     - knowledgeQuality: 0 → 75分
echo.
echo   【第2轮】添加 Computed 错误处理
echo     - benchmarkData: 添加 try-catch
echo     - performanceStats: 添加默认值
echo     - errorAnalysis: 添加默认值
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo 正在打开监控页面...
start http://localhost:3002/admin/monitoring-dashboard
echo.
timeout /t 2 /nobreak >nul
echo.
echo ═══════════════════════════════════════════════════════════
echo   📋 测试步骤 (非常重要!)
echo ═══════════════════════════════════════════════════════════
echo.
echo   步骤 1: 硬刷新页面 (清除缓存)
echo           ▶ 按 Ctrl + Shift + R
echo.
echo   步骤 2: 测试标签切换
echo           ▶ 点击 "性能监控" 标签
echo           ▶ 点击 "告警管理" 标签
echo           ▶ 点击 "优化建议" 标签
echo           ▶ 点击 "系统配置" 标签
echo.
echo   步骤 3: 检查控制台
echo           ▶ 按 F12 打开开发者工具
echo           ▶ 切换到 Console 标签
echo           ▶ 查看是否有红色错误
echo.
echo ═══════════════════════════════════════════════════════════
echo   💡 如果标签页仍然无法切换
echo ═══════════════════════════════════════════════════════════
echo.
echo   方案 A: 清除所有缓存
echo.
echo   在控制台 (F12 → Console) 执行:
echo.
echo     localStorage.clear();
echo     sessionStorage.clear();
echo     location.reload(true);
echo.
echo   ─────────────────────────────────────────────────────────
echo.
echo   方案 B: 手动测试切换
echo.
echo   在控制台执行:
echo.
echo     console.log('当前标签:', activeTab.value)
echo     activeTab.value = 'alerts'
echo     console.log('切换后:', activeTab.value)
echo.
echo   ─────────────────────────────────────────────────────────
echo.
echo   方案 C: 检查标签页元素
echo.
echo   在控制台执行:
echo.
echo     const tabs = document.querySelectorAll('.el-tabs__item')
echo     console.log('标签页数量:', tabs.length)
echo     tabs.forEach((t,i) =^> console.log(`标签${i}:`, t.textContent))
echo.
echo ═══════════════════════════════════════════════════════════
echo   📝 请告诉我测试结果
echo ═══════════════════════════════════════════════════════════
echo.
echo   1. 标签页是否可以切换? (是/否)
echo   2. 控制台是否有错误? (有/无)
echo   3. 手动切换是否成功? (成功/失败)
echo.
echo ═══════════════════════════════════════════════════════════
echo.
pause
