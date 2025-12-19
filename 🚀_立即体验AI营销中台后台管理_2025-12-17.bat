@echo off
echo ========================================
echo 🚀 AI营销中台后台管理系统
echo ========================================
echo.
echo 正在启动开发服务器...
echo.

cd /d "%~dp0"
start http://localhost:3003/admin/login
echo.
echo ✅ 浏览器已打开管理登录页面
echo.
echo 📋 使用说明：
echo 1. 登录后台管理系统（需要管理员Token）
echo 2. 点击菜单"🚀 AI营销中台"
echo 3. 切换不同Tab配置各Phase功能
echo.
echo 💡 功能亮点：
echo    - Phase 2: AI驱动营销配置
echo    - Phase 3: 营销自动化配置
echo    - Phase 4: 数据分析配置
echo    - AI训练中心：模型训练与监控
echo    - 系统配置：全局参数设置
echo.
echo ========================================
pause
