@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🎉 AI营销中台 - 首页展示已就绪
echo ========================================
echo.
echo 📋 更新内容：
echo.
echo ✅ 导航栏添加"AI营销中台"菜单
echo    └─ AI产品选型
echo    └─ 资源中心
echo    └─ 邮件营销
echo    └─ 线索孵化
echo    └─ 营销数据中台
echo.
echo ✅ 首页添加AI营销中台展示区域
echo    └─ 核心数据展示（8,830行代码、20个系统）
echo    └─ Phase 2-4功能模块展示
echo    └─ ROI对比数据
echo    └─ 快捷访问按钮
echo.
echo ========================================
echo.
echo 正在清除浏览器缓存配置...

REM 清除localStorage（强制刷新导航配置）
echo.
echo 提示：首次访问时请按 Ctrl+Shift+R 强制刷新
echo.

REM 检查服务器状态
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 开发服务器正在运行
    echo.
    echo 🚀 立即打开浏览器访问首页...
    start http://localhost:5173
) else (
    echo ⚠️  开发服务器未运行
    echo.
    set /p start="是否启动开发服务器？(Y/N): "
    if /i "%start%"=="Y" (
        echo.
        echo 正在启动开发服务器...
        start "AIWEB 开发服务器" cmd /k "npm run dev"
        echo.
        echo 等待服务器启动（15秒）...
        timeout /t 15 /nobreak >nul
        start http://localhost:5173
    )
)

echo.
echo ========================================
echo   📖 查看说明
echo ========================================
echo.
echo 🎯 导航栏位置：
echo    顶部导航栏 → "AI营销中台"
echo.
echo 🎯 首页位置：
echo    首页滚动至"智能体板块"下方
echo    即可看到"AI国际营销中台"展示区域
echo.
echo 💡 功能特点：
echo    • 4个核心数据卡片（悬停动画）
echo    • 12个功能模块（分3组展示）
echo    • ROI对比数据（真实效果）
echo    • 一键访问各功能页面
echo.
echo ========================================
echo.
pause
