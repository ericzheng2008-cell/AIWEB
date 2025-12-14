@echo off
chcp 65001 > nul
echo.
echo ========================================
echo   测试产品技术销售小课堂功能
echo ========================================
echo.
echo 前台页面: http://localhost:5173/tech-classroom
echo 后台管理: http://localhost:5173/admin/classroom
echo.
echo 按任意键打开浏览器...
pause > nul

start http://localhost:5173/tech-classroom
timeout /t 2 > nul
start http://localhost:5173/admin/classroom

echo.
echo 已打开测试页面！
echo.
pause
