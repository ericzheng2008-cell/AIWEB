@echo off
chcp 65001 >nul
cls
echo.
echo ========================================
echo    🧪 AICRM P0 & P1优化功能测试
echo ========================================
echo.
echo 📋 测试清单:
echo.
echo [P0-1] 数据质量监控
echo   ✓ 打开 AICRM → 数据质量 标签
echo   ✓ 查看质量总览、数据源同步、清洗规则
echo.
echo [P0-2] AI可解释性
echo   ✓ 任意AI预测页面
echo   ✓ 查看置信度、影响因素、模型信息
echo.
echo [P0-3] 性能优化
echo   ✓ 大数据列表滚动(虚拟滚动)
echo   ✓ 图表更新防抖测试
echo.
echo [P1-1] 移动端适配
echo   ✓ 调整浏览器窗口大小(<768px)
echo   ✓ 查看响应式布局变化
echo.
echo [P1-2] 实时协作
echo   ✓ 打开协作面板
echo   ✓ 查看在线用户、共享会话
echo.
echo ========================================
echo 正在启动开发服务器...
echo ========================================
echo.

cd /d "%~dp0"
npm run dev

pause
