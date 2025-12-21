@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    🔧 一键修复500错误并重启服务器
echo ========================================
echo.
echo 📌 问题：MaterialDownload组件i18n翻译缺失
echo ✅ 修复：已添加materials翻译到zh-CN和en-US
echo.
echo ⏳ 正在重启开发服务器...
echo.

:: 停止所有Node进程
echo 🛑 停止现有Node进程...
taskkill /F /IM node.exe >nul 2>&1

:: 等待2秒
timeout /t 2 /nobreak >nul

:: 启动开发服务器
echo 🚀 启动开发服务器...
start "AIWEB前端服务器" cmd /k "cd /d %~dp0 && npm run dev"

:: 等待5秒让服务器启动
echo ⏳ 等待服务器启动...
timeout /t 5 /nobreak

:: 打开浏览器（强制刷新模式）
echo 🌐 打开浏览器并清除缓存...
start chrome --new-window --incognito "http://localhost:3002"

echo.
echo ========================================
echo    ✅ 操作完成！
echo ========================================
echo.
echo 📖 使用提示：
echo   1. 浏览器将以隐身模式打开（自动清除缓存）
echo   2. 滚动到"📥 资料下载与索取报价"模块
echo   3. 点击"查看所有资料"测试功能
echo   4. 测试分类切换、搜索、注册、下载等功能
echo.
echo 🔍 如果仍有问题，请按Ctrl+Shift+R强制刷新
echo.
pause
