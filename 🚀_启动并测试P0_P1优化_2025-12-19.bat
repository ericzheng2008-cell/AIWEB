@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🚀 AICRM P0 & P1 优化功能测试
echo ========================================
echo.
echo ⏳ 正在启动开发服务器...
echo.

cd /d "%~dp0"

:: 检查端口占用
netstat -ano | findstr :5173 >nul
if %errorlevel%==0 (
    echo ⚠️  端口5173已被占用,正在清理...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
        taskkill /F /PID %%a 2>nul
    )
    timeout /t 2 /nobreak >nul
)

:: 启动开发服务器
start "AICRM Dev Server" cmd /k "npm run dev"

echo.
echo ⏳ 等待服务器启动(预计15秒)...
timeout /t 15 /nobreak

echo.
echo ========================================
echo   📋 测试检查清单
echo ========================================
echo.
echo ✅ P0-1: 数据质量监控面板
echo    → 导航: AICRM首页 → 点击"数据质量"标签
echo    → 检查: 4个质量指标卡片 + 实时同步状态
echo.
echo ✅ P0-2: AI预测可解释性
echo    → 导航: 投标预测AI / 客户沙盘
echo    → 检查: 置信度显示 + 影响因素权重
echo.
echo ✅ P0-3: 性能优化
echo    → 导航: 客户360画像(大数据列表)
echo    → 检查: 虚拟滚动流畅性(F12查看渲染时间)
echo.
echo ✅ P1-1: 移动端响应式
echo    → 操作: 调整浏览器窗口至手机尺寸(<768px)
echo    → 检查: 布局自适应 + 图表简化显示
echo.
echo ✅ P1-2: 实时协作功能
echo    → 导航: 点击右下角"协作"按钮
echo    → 检查: 在线用户列表 + 共享会话面板
echo.
echo ========================================
echo.
echo 🌐 正在打开浏览器...
timeout /t 2 /nobreak >nul
start http://localhost:5173

echo.
echo ========================================
echo   🎯 快速测试路径
echo ========================================
echo.
echo 1. 首页 → AICRM卡片 → 进入系统
echo 2. 点击顶部"数据质量"标签 (新增!)
echo 3. 切换到"投标预测AI" → 查看置信度
echo 4. 打开F12控制台 → 检查性能日志
echo 5. Ctrl+Shift+M 切换移动端视图
echo 6. 点击右下角协作图标
echo.
echo ========================================
echo   📊 性能指标参考
echo ========================================
echo.
echo • 大列表渲染: <200ms ✅
echo • 首屏加载: <1.5s ✅
echo • 图表更新: 防抖300ms ✅
echo • WebSocket延迟: <100ms ✅
echo.
echo 按任意键查看完整报告...
pause >nul
notepad 📊_AICRM_P0_P1优化完成报告_2025-12-18.md
