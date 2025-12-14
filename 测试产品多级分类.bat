@echo off
chcp 65001 >nul
echo ========================================
echo   测试产品与服务多级分类系统
echo ========================================
echo.
echo 🔄 正在启动开发服务器...
echo.
start cmd /k "cd /d %~dp0 && npm run dev"
timeout /t 5 /nobreak >nul
echo.
echo ✅ 开发服务器已启动
echo.
echo 📋 测试步骤：
echo.
echo 1. 前台测试（http://localhost:3003/products-services）
echo    - 查看6个子系统卡片展示
echo    - 点击卡片查看二级分类
echo    - 点击二级分类查看三级分类
echo    - 点击三级分类查看产品列表
echo.
echo 2. 后台测试（http://localhost:3003/admin/products-services）
echo    - 管理一级分类（6个子系统）
echo    - 管理二级分类
echo    - 管理三级分类
echo    - 管理产品详情
echo    - 编辑页面横幅（PANTONE 2736C）
echo.
echo 🎨 配色方案：
echo    主色：PANTONE 2736C (#0047BB)
echo    渐变：#0047BB → #0066dd
echo.
echo 🌐 正在打开浏览器...
timeout /t 3 /nobreak >nul
start http://localhost:3003/products-services
timeout /t 2 /nobreak >nul
start http://localhost:3003/admin/products-services
echo.
echo ✅ 浏览器已打开！
echo.
pause
