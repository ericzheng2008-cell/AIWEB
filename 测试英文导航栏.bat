@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   测试英文版导航栏翻译
echo ========================================
echo.
echo 正在打开浏览器...
echo.
echo 测试步骤：
echo 1. 等待页面加载完成
echo 2. 点击顶部导航栏右上角的 "EN / 中文" 切换语言
echo 3. 检查所有导航栏项目是否正确显示英文
echo 4. 检查下拉子菜单是否正确显示英文
echo.
echo 主要更新：
echo ✓ 首页 → Home
echo ✓ 产品与服务 → Products ^& Services
echo ✓ 事业部 → Business Divisions
echo ✓ 应用案例 → Case Studies
echo ✓ AI智能体 → AI Solutions
echo ✓ 关于我们 → About Us
echo ✓ 服务与支持 → Service ^& Support
echo ✓ 联系我们 → Contact Us
echo.
echo 所有子菜单也已优化翻译！
echo.
start http://localhost:5173
echo.
echo 按任意键关闭此窗口...
pause >nul
