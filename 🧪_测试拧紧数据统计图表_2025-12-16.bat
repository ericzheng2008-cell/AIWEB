@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   测试拧紧数据统计分析图表
echo ========================================
echo.
echo 📊 图表优化完成！
echo.
echo ✅ 优化内容：
echo   1. 扭矩分布图 - 改为直方图展示
echo   2. OK率趋势图 - 分组统计+参考线
echo.
echo 🎯 测试重点：
echo   - 扭矩分布直方图清晰度
echo   - 智能着色(绿/红/橙)
echo   - OK率趋势分析
echo   - 目标线和平均线
echo.
echo 正在启动浏览器...
timeout /t 2 /nobreak >nul

start http://localhost:3003/admin/tightening-data

echo.
echo ========================================
echo 📋 测试步骤：
echo ========================================
echo.
echo 1. 点击"数据分析"标签页
echo 2. 查看"OK率趋势分析"图表
echo    - 批次分组是否清晰
echo    - 颜色分级是否合理
echo    - 目标线/平均线是否显示
echo.
echo 3. 查看"扭矩分布直方图"
echo    - 柱状图是否清晰
echo    - 绿/红/橙色着色是否正确
echo    - 数量标注是否显示
echo    - 悬浮提示是否包含占比
echo.
echo 4. 调整筛选条件测试
echo    - 日期范围
echo    - 结果筛选
echo    - 车间/线体/工具型号
echo.
echo 5. 观察图表动态更新
echo.
echo ========================================
echo 💡 查看详细文档：
echo ✅_拧紧数据统计分析图表优化完成_2025-12-16.md
echo ========================================
echo.
pause
