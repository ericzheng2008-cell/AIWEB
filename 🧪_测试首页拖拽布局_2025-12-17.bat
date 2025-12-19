@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🎨 首页产品服务拖拽布局测试
echo ========================================
echo.
echo 📋 测试步骤:
echo.
echo 【方式一：前台拖拽（管理员专享）】
echo 1. 后台登录: http://localhost:5173/admin/login
echo 2. 访问首页: http://localhost:5173/
echo 3. 滚动到"产品与服务"模块
echo 4. 直接拖拽卡片调整顺序
echo 5. 刷新页面验证顺序保持
echo.
echo 【方式二：后台管理页面】
echo 1. 访问: http://localhost:5173/admin/home-layout
echo 2. 拖拽卡片右上角的圆形图标
echo 3. 点击"保存顺序"按钮
echo 4. 打开前台首页验证效果
echo.
echo ========================================
echo.
echo 🚀 正在启动开发服务器...
echo.

cd /d "%~dp0"
start http://localhost:5173/admin/home-layout
npm run dev

pause
