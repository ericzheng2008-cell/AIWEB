@echo off
echo ========================================
echo    图片上传功能测试
echo ========================================
echo.
echo 1. Banner朦胧效果RGB调色
echo    http://localhost:5173/admin/content
echo.
echo 2. 明星产品图片上传
echo    http://localhost:5173/admin/content (明星产品标签页)
echo.
echo 3. 产品与服务图片上传
echo    http://localhost:5173/admin/products-services
echo.
echo ========================================
echo 正在打开后台管理页面...
echo ========================================
timeout /t 2 >nul

start http://localhost:5173/admin/content

echo.
echo ✅ 测试指南已打开，请查看：
echo    🧪_测试图片上传功能_2025-12-17.md
echo.
start "" "🧪_测试图片上传功能_2025-12-17.md"

pause
