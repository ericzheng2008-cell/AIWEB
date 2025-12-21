@echo off
chcp 65001 >nul
color 0A
title 🔧 清理Vite缓存并重启服务器

echo.
echo ╔══════════════════════════════════════════╗
echo ║   🔧 清理Vite缓存并重启服务器           ║
echo ╚══════════════════════════════════════════╝
echo.

echo [1/5] 停止所有Node进程...
taskkill /F /IM node.exe 2>nul
if %errorlevel%==0 (
    echo ✅ Node进程已停止
) else (
    echo ⚠️  没有运行中的Node进程
)
timeout /t 2 /nobreak >nul

echo.
echo [2/5] 删除node_modules/.vite缓存...
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
    echo ✅ Vite缓存已删除
) else (
    echo ⚠️  Vite缓存不存在
)

echo.
echo [3/5] 删除node_modules/.cache缓存...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo ✅ Cache缓存已删除
) else (
    echo ⚠️  Cache缓存不存在
)

echo.
echo [4/5] 清理npm缓存...
call npm cache clean --force
echo ✅ npm缓存已清理

echo.
echo [5/5] 启动开发服务器（强制预构建依赖）...
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   服务器将在新窗口启动，请等待...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

start "AIWEB前端服务器" cmd /k "npm run dev -- --force"

echo.
echo ⏳ 等待15秒让服务器完全启动...
timeout /t 15 /nobreak

echo.
echo ✅ 服务器已启动！正在打开浏览器...
start http://localhost:5173

echo.
echo ╔══════════════════════════════════════════╗
echo ║          🎉 操作完成！                   ║
echo ╚══════════════════════════════════════════╝
echo.
echo 📝 操作说明:
echo    1. 已清理所有Vite缓存
echo    2. 已强制重新预构建依赖
echo    3. 浏览器将自动打开
echo.
echo ⚠️  如果仍有504错误:
echo    1. 关闭浏览器
echo    2. 按 Ctrl+Shift+Delete 清除浏览器缓存
echo    3. 重新访问 http://localhost:5173
echo.
pause
