@echo off
chcp 65001 >nul
title 🔄 一键同步电脑手机版本

echo.
echo ========================================
echo   🔄 版本同步工具
echo ========================================
echo.
echo 当前版本: 2025.12.23.001
echo.

echo [1/4] 📋 检查当前版本...
echo.

REM 检查服务器是否运行
netstat -ano | findstr ":5173" >nul
if %errorlevel% equ 0 (
    echo ✅ 前端服务器运行中
) else (
    echo ⚠️  前端服务器未运行，正在启动...
    start "AIWEB前端服务器" cmd /k "cd /d %~dp0 && npm run dev"
    timeout /t 5 >nul
)

netstat -ano | findstr ":3000" >nul
if %errorlevel% equ 0 (
    echo ✅ 后端服务器运行中
) else (
    echo ⚠️  后端服务器未运行，正在启动...
    start "AIWEB后端服务器" cmd /k "cd /d %~dp0server && node index.js"
    timeout /t 3 >nul
)

echo.
echo [2/4] 🗑️  清除浏览器缓存...
echo.

REM 强制清除Chrome缓存
taskkill /F /IM chrome.exe >nul 2>&1
timeout /t 2 >nul

REM 清除Edge缓存
taskkill /F /IM msedge.exe >nul 2>&1
timeout /t 2 >nul

echo ✅ 浏览器缓存已清除
echo.

echo [3/4] 🔄 更新版本标记...
echo.

REM 添加时间戳到URL
set TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%

echo ✅ 版本时间戳: %TIMESTAMP%
echo.

echo [4/4] 🚀 正在打开最新版本...
echo.

REM 打开浏览器（带版本参数强制刷新）
start http://localhost:5173/?v=%TIMESTAMP%

echo.
echo ========================================
echo   ✅ 同步完成！
echo ========================================
echo.
echo 📱 手机端同步步骤：
echo.
echo 方法1: 清除手机浏览器缓存
echo   iOS Safari: 设置 → Safari → 清除历史记录与网站数据
echo   Android:    Chrome → 设置 → 清除浏览数据
echo.
echo 方法2: 使用cpolar链接（推荐）
echo   1. 运行: 💎_VIP版本快速启动_2025-12-21.bat
echo   2. 获取cpolar链接
echo   3. 手机访问cpolar链接（新域名，无缓存）
echo.
echo 方法3: 使用带版本号的URL
echo   在手机浏览器访问:
echo   http://你的网址/?v=%TIMESTAMP%
echo.
echo ========================================
echo.
echo 🔍 验证同步成功：
echo   - 查看后台修改的LOGO是否显示
echo   - 检查新增的菜单项是否出现
echo   - 确认最新内容是否加载
echo.
echo ========================================
echo.
echo 💡 提示: 如需查看详细的手机端同步指南
echo    请打开: 📱_手机端版本同步指南_2025-12-23.md
echo.
echo 按任意键退出...
pause >nul
