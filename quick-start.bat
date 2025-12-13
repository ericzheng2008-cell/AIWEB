@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo 正在启动开发服务器...
echo 如果出现错误，请将错误信息截图发给我
echo.
echo 预期结果：显示 "VITE v5.x.x ready in xxx ms"
echo 然后显示 "Local: http://localhost:3000/"
echo.
echo ========================================
echo.

npm run dev

pause
