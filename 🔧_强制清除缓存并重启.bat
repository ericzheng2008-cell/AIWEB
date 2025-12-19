@echo off
chcp 65001 >nul
echo ========================================
echo    强制清除缓存并重启开发服务器
echo ========================================
echo.

echo [步骤1] 停止所有Node进程...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [步骤2] 清理Vite缓存...
if exist node_modules\.vite rmdir /s /q node_modules\.vite
echo ✅ Vite缓存已清理

echo [步骤3] 清理dist目录...
if exist dist rmdir /s /q dist
echo ✅ dist目录已清理

echo.
echo [步骤4] 启动开发服务器...
start "Vite Dev Server" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo  ✅ 服务器已重启，正在打开浏览器...
echo ========================================
echo.
echo 💡 请按 Ctrl+F5 强制刷新浏览器
echo 💡 或按 Ctrl+Shift+Del 清除浏览器缓存
echo.

timeout /t 2 /nobreak >nul
start http://localhost:8080

pause
