@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    🚀 P2-3 数据治理功能测试
echo ========================================
echo.
echo 测试项目:
echo   ✅ P2-1: 项目快照引擎
echo   ✅ P2-2: 时序数据仓库
echo   ✅ P2-3: 核心指标计算(OEE/SPI/CPI)
echo.
echo ----------------------------------------
echo 请按以下步骤操作:
echo ----------------------------------------
echo.
echo 1️⃣  访问: http://localhost:3002/#/aicrm
echo.
echo 2️⃣  点击 "AIPM项目管理" 标签
echo.
echo 3️⃣  点击右上角 "刷新" 按钮
echo     → 查看提示: "数据已刷新，生成X个项目快照"
echo.
echo 4️⃣  按 F12 打开控制台
echo.
echo 5️⃣  输入以下命令查看快照:
echo     console.table(projectSnapshots.value[0])
echo.
echo 6️⃣  查看时序数据库:
echo     console.log('每日快照:', timeSeriesDB.value.daily.length)
echo     console.log('每周汇总:', timeSeriesDB.value.weekly)
echo.
echo 7️⃣  查看项目指标:
echo     const metrics = calculateProjectMetrics(aipmProjects.value[0])
echo     console.table(metrics)
echo.
echo ========================================
echo   期望结果:
echo ========================================
echo.
echo ✅ 快照包含8大维度:
echo    - progress: {planned, actual, deviation, spi}
echo    - budget: {total, spent, cpi, ev, pv, ac}
echo    - schedule: {totalDays, elapsedDays, remainingDays}
echo    - team: {size, velocity}
echo    - risks: []
echo    - quality: {taskCompletionRate}
echo.
echo ✅ 每日快照最多30条
echo ✅ 每周汇总自动计算avgSPI/avgCPI
echo ✅ OEE综合效率分数(0-100)
echo.
echo ========================================
echo 按任意键打开浏览器...
echo ========================================
pause >nul

start http://localhost:3002/#/aicrm
