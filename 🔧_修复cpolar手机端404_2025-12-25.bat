@echo off
chcp 65001 >nul
title 🔧 修复cpolar手机端404问题

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║       🔧 修复cpolar手机端404问题 - 快速解决方案              ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📋 问题原因：
echo    Vue Router使用HTML5 History模式，手机端刷新页面时找不到路由
echo.
echo 🎯 解决方案：
echo    方案1: 修改路由模式为Hash模式（推荐）
echo    方案2: 配置Vite中间件处理所有路由（仅开发环境）
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo 请选择解决方案：
echo.
echo   [1] 使用Hash模式（推荐 - 兼容性最好）
echo   [2] 配置Vite中间件（开发环境专用）
echo   [3] 查看详细说明
echo   [0] 退出
echo.
set /p choice=请输入选项 (0-3): 

if "%choice%"=="1" goto hash_mode
if "%choice%"=="2" goto vite_middleware
if "%choice%"=="3" goto show_details
if "%choice%"=="0" goto end

:hash_mode
echo.
echo ⏳ 正在修改为Hash模式...
echo.

REM 备份原文件
copy /Y "src\router\index.js" "src\router\index.js.backup.%date:~0,4%%date:~5,2%%date:~8,2%" >nul

REM 使用PowerShell修改文件
powershell -Command "(Get-Content 'src\router\index.js') -replace 'createWebHistory\(\)', 'createWebHashHistory()' | Set-Content 'src\router\index.js'"
powershell -Command "(Get-Content 'src\router\index.js') -replace 'import \{ createRouter, createWebHistory \}', 'import { createRouter, createWebHashHistory }' | Set-Content 'src\router\index.js'"

echo ✅ 路由模式已修改为Hash模式
echo.
echo 📝 修改后的效果：
echo    原URL: https://xxx.cpolar.cn/products
echo    新URL: https://xxx.cpolar.cn/#/products
echo.
echo 🔄 现在需要重启前端服务器...
pause
goto restart_frontend

:vite_middleware
echo.
echo ⏳ 正在配置Vite中间件...
echo.

REM 备份原文件
copy /Y "vite.config.js" "vite.config.js.backup.%date:~0,4%%date:~5,2%%date:~8,2%" >nul

REM 添加中间件配置
powershell -Command "$content = Get-Content 'vite.config.js' -Raw; $content = $content -replace '(server: \{[^}]*)(proxy:)', '$1// 处理所有路由回退`n    historyApiFallback: true,`n    $2'; Set-Content 'vite.config.js' $content"

echo ✅ Vite配置已更新
echo.
echo 🔄 现在需要重启前端服务器...
pause
goto restart_frontend

:restart_frontend
echo.
echo ⏳ 正在重启前端服务器...
echo.

REM 停止所有Node进程
taskkill /F /IM node.exe >nul 2>&1

REM 等待2秒
timeout /t 2 /nobreak >nul

REM 启动前端服务器
start "AIWEB前端" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ✅ 前端服务器重启完成！
echo.
echo 📱 测试步骤：
echo    1. 等待前端服务器启动（约10秒）
echo    2. 在手机浏览器打开cpolar链接
echo    3. 浏览不同页面并刷新测试
echo.
pause
goto end

:show_details
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              📖 手机端404问题详细说明                        ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 🔍 问题根源：
echo ════════════════════════════════════════════════════════════
echo.
echo 1. Vue Router默认使用HTML5 History模式
echo    - URL格式: https://xxx.cpolar.cn/products
echo    - 需要服务器配置支持
echo.
echo 2. cpolar作为反向代理
echo    - 转发请求到localhost:5173
echo    - 但刷新页面时找不到/products文件
echo.
echo 3. 电脑端正常的原因
echo    - Vite开发服务器自动处理所有路由
echo    - 直接访问localhost:5173没有经过cpolar
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo ✅ 方案1: Hash模式（推荐）
echo ════════════════════════════════════════════════════════════
echo.
echo 优点:
echo   ✓ 100%兼容所有环境
echo   ✓ 无需服务器配置
echo   ✓ 手机/电脑/cpolar都能用
echo.
echo 缺点:
echo   ✗ URL中有#号 (xxx.cpolar.cn/#/products)
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo ✅ 方案2: Vite中间件（开发环境）
echo ════════════════════════════════════════════════════════════
echo.
echo 优点:
echo   ✓ URL更美观 (xxx.cpolar.cn/products)
echo.
echo 缺点:
echo   ✗ 仅开发环境有效
echo   ✗ 生产环境需要nginx配置
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo 💡 建议：
echo    - 开发/演示阶段：使用Hash模式（方案1）
echo    - 生产环境部署：配置nginx rewrite规则
echo.
pause
goto end

:end
echo.
echo 👋 感谢使用！
timeout /t 2 /nobreak >nul
exit
